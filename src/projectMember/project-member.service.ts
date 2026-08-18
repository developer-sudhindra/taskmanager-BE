import { ConflictException, Injectable } from '@nestjs/common';
import { ProjectMember } from './project-member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMemberDto } from './add-member.dto';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepository: Repository<ProjectMember>,
  ) {}

  public async createProjectMember(
    projectId: string,
    AddMemberDto: AddMemberDto,
  ): Promise<any> {
    const projectMemberQuery =
      this.projectMemberRepository.createQueryBuilder('project_member');
    const existingMember = await projectMemberQuery
      .where('project_member.projectId = :projectId', { projectId })
      .andWhere('project_member.userId = :userId', {
        userId: AddMemberDto.userId,
      })
      .getOne();

    if (existingMember) {
      throw new ConflictException('User is already assigned to this project.');
    }

    const newProjectMember = this.projectMemberRepository.create({
      ...AddMemberDto,
      projectId,
    });

    return await this.projectMemberRepository.save(newProjectMember);
  }
}
