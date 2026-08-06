import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from './find-task-params';
import { PaginationParams } from '../common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelRepository: Repository<TaskLabel>,
  ) {}

  public async findByProject(projectId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { projectId },
    });
  }

  public async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams,
    userId: string,
  ): Promise<[Task[], number]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels')
      .andWhere('task.userId = :userId', { userId });

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...names)', { names: filters.labels })
        .getQuery();

      query.andWhere(`task.id IN (${subQuery})`);
    }

    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);

    query.skip(pagination.offset).take(pagination.limit);

    return query.getManyAndCount();
  }

  public async findOne(id: string): Promise<Task | null> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.leftJoinAndSelect('task.labels', 'labels');
    query.andWhere('task.id = :id', { id });
    return query.getOne();
  }

  public async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const uniqueLabels = createTaskDto.labels
      ? this.getUniqueLabels(createTaskDto.labels)
      : [];

    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      priority: createTaskDto.priority as any,
      type: createTaskDto.type,
      projectId: createTaskDto.projectId,
      userId: userId,
      labels: uniqueLabels?.map((label) => ({
        name: label.name,
      })),
    });

    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }

    return await this.taskRepository.save(task);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    // check for transition status of ticket
    if (
      updateTaskDto.status &&
      !this.isValidStateTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    // removing dublicate labels
    const { labels, ...scalarFields } = updateTaskDto;

    // 3. Update title, description, priority safely without touching relationships
    Object.assign(task, scalarFields);

    if (labels) {
      const uniqueIncoming = this.getUniqueLabels(labels);

      const existingLabels = task.labels || [];

      task.labels = uniqueIncoming.map((incomingLabel) => {
        const matchedDbRecord = existingLabels.find(
          (existing) => existing.name === incomingLabel.name,
        );
        return matchedDbRecord ? matchedDbRecord : (incomingLabel as any);
      });
    }
    return await this.taskRepository.save(task);
  }

  public async addLabels(
    task: Task,
    labelDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    const names = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelDtos)
      .filter((dto) => !names.has(dto.name))
      .map((label) => this.labelRepository.create(label));
    if (labels.length > 0) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  public async removeLabels(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );
    return await this.taskRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.taskRepository.remove(task);
  }

  private isValidStateTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelsDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelsDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
  }
}
