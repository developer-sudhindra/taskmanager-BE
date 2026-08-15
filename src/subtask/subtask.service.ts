import { Injectable } from '@nestjs/common';
import {} from './find-task-params';
import { InjectRepository } from '@nestjs/typeorm';
import { Subtask } from './subtask.entity';
import { Repository } from 'typeorm';
import { CreateSubtaskDto } from './create-subtask.dto';

@Injectable()
export class SubtaskService {
  constructor(
    @InjectRepository(Subtask)
    private readonly subtaskRepository: Repository<Subtask>,
  ) {}

  public async findAll(taskId: string): Promise<Subtask[]> {
    const subTaskQuery = this.subtaskRepository
      .createQueryBuilder('subtask')
      .where('subtask.taskId = :taskId', { taskId });
    const subtasks = await subTaskQuery.getMany();
    return subtasks;
  }

  public async createSubTask(
    createSubTaskDto: CreateSubtaskDto,
  ): Promise<Subtask> {
    const subTask = this.subtaskRepository.create(createSubTaskDto);
    return await this.subtaskRepository.save(subTask);
  }

  public async updateSubTask(
    subTaskId: string,
    updateSubTaskDto: CreateSubtaskDto,
  ): Promise<Partial<Subtask>> {
    const subTaskQuery = await this.subtaskRepository
      .createQueryBuilder('subtask')
      .where('subtask.id = :subTaskId', { subTaskId })
      .update(updateSubTaskDto)
      .execute();

    return updateSubTaskDto;
  }

  public async findOne(subTaskId: string): Promise<Subtask> {
    const subTask = await this.findOneOrFail(subTaskId);
    return subTask;
  }

  private async findOneOrFail(subTaskId: string): Promise<Subtask> {
    const subTask = await this.subtaskRepository
      .createQueryBuilder('subtask')
      .where('subtask.id = :subTaskId', { subTaskId })
      .getOne();
    if (!subTask) {
      throw new Error('Subtask not found');
    }
    return subTask;
  }
}
