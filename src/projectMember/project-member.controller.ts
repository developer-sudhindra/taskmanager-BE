import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { AddMemberDto } from './add-member.dto';
import { AuthGuard } from '../users/auth.guard';
import { ProjectRoleGuard } from './project-role.guard';
import { ProjectRole } from './project-member.entity';
import { RequireProjectRoles } from './roles.decorator';

@Controller('projects/:projectId/members')
@UseGuards(AuthGuard, ProjectRoleGuard)
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Post()
  @RequireProjectRoles(ProjectRole.ADMIN, ProjectRole.OWNER)
  public async createProjectMember(@Body() addMemberDto: AddMemberDto) {
    return this.projectMemberService.createProjectMember(
      addMemberDto.projectId,
      addMemberDto,
    );
  }
}
