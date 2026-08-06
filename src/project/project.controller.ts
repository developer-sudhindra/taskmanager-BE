import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FindOneParams } from './find-one.params';
import { CreateProjectDto } from './create-project.dto';
import { Project } from './project.entity';
import { UpdateProjectStatusDto } from './Update-project-status.dto';
import { ProjectRoleGuard } from '../projectMember/project-role.guard';
import { RequireProjectRoles } from '../projectMember/roles.decorator';
import { ProjectRole } from '../projectMember/project-member.entity';
import { CurrentUserId } from '../users/decorators/current-user-id.decorator';

@Controller('project')
export class ProjectController {
  constructor(public readonly projectService: ProjectService) {}

  @Get()
  public async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Get('/:projectId')
  @RequireProjectRoles(
    ProjectRole.OWNER,
    ProjectRole.ADMIN,
    ProjectRole.MEMBER,
    ProjectRole.VIEWER,
  )
  public async findOne(@Param() params: FindOneParams): Promise<Project> {
    return await this.projectService.findOne(params.projectId);
  }

  @Post()
  public async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUserId() userId: string,
  ): Promise<Project> {
    return await this.projectService.create(createProjectDto, userId);
  }

  @Patch('/:id')
  @UseGuards(ProjectRoleGuard)
  @RequireProjectRoles(ProjectRole.OWNER, ProjectRole.ADMIN)
  public async updateProjectStatus(
    @Param('id') id: string,
    @Body() updateProjectStatusDto: UpdateProjectStatusDto,
  ): Promise<Project> {
    return await this.projectService.updateProjectStatus(
      id,
      updateProjectStatusDto.status,
    );
  }
}
