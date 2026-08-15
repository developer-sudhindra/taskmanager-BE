import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectMember, ProjectRole } from './project-member.entity';
import { ROLES_KEY } from './roles.decorator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ProjectRoleGuard {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get required roles from the route decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<ProjectRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are explicitly required by a decorator, allow access by default
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Authentication required for role verification',
      );
    }

    // 2. Dynamically extract projectId from params, body, or query string

    const projectId =
      request.params.projectId ||
      request.body?.projectId ||
      request.query?.projectId;

    if (!projectId) {
      throw new ForbiddenException('Project tracking ID missing from context');
    }

    // 3. Query the DB to check if this user belongs to the project

    const member = await this.projectMemberRepository.findOne({
      where: { userId: user.id, projectId },
    });

    if (!member) {
      throw new ForbiddenException(
        'You are not a designated member of this project',
      );
    }

    // 4. Verify if the member's role matches one of the authorized route roles
    const hasRole = requiredRoles.includes(member.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Requires structural privileges: [${requiredRoles.join(', ')}]`,
      );
    }

    request['projectMember'] = member;

    return true;
  }
}
