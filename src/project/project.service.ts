import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './create-project.dto';
import { TasksService } from '../tasks/tasks.service';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectStatus } from './project.model';
import {
  ProjectMember,
  ProjectRole,
} from '../projectMember/project-member.entity';

@Injectable()
export class ProjectService {
  constructor(
    private readonly taskService: TasksService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepository: Repository<ProjectMember>,
  ) {}

  public async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const newProject = {
      ...createProjectDto,
      createdAt: new Date(),
    };

    const savedProject = await this.projectRepository.save(newProject);

    const ownerMember = this.projectMemberRepository.create({
      projectId: savedProject.id,
      userId: userId,
      role: ProjectRole.OWNER,
    });

    await this.projectMemberRepository.save(ownerMember);
    return savedProject;
  }

  public async findAll(): Promise<Project[] | []> {
    const projects = await this.projectRepository
      .createQueryBuilder('project') // Aliases the root table as 'project' cleanly
      .leftJoin('project.tasks', 'tasks') // Joins your tasks relation table
      .select('project') // Selects standard base project model columns
      .addSelect('COUNT(tasks.id)', 'project_taskCount') // 2. FIXED: Matched count alias to joined table name 'tasks'
      .groupBy('project.id')
      .getMany();

    return projects.map((project: Project) => {
      project.taskCount = Number((project as any).project_taskCount || 0);
      return project;
    });
  }

  public async findOne(projectId: string): Promise<Project> {
    const projectQuery = this.projectRepository.createQueryBuilder('project');
    projectQuery.where('project.id = :projectId', { projectId });
    projectQuery.leftJoinAndSelect('project.tasks', 'tasks');

    const project = await projectQuery.getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      ...project,
      tasks: project.tasks,
    };
  }

  public async updateProjectStatus(
    id: string,
    status: ProjectStatus,
  ): Promise<Project> {
    const updateResult = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set({ status })
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return this.findOne(id);
  }

  public async updateProject(
    id: string,
    updateProjectDto: Partial<CreateProjectDto>,
  ): Promise<Project> {
    const updateResult = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set(updateProjectDto)
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException('Project not found');
    }

    return this.findOne(id);
  }
}
