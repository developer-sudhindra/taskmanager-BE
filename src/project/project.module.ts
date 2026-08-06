import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TasksModule } from '../tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRoleGuard } from '../projectMember/project-role.guard';
import { ProjectMember } from '../projectMember/project-member.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRoleGuard],
  imports: [TasksModule, TypeOrmModule.forFeature([Project, ProjectMember])],
  exports: [ProjectRoleGuard, TypeOrmModule],
})
export class ProjectModule {}
