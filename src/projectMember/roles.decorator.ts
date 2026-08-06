import { SetMetadata } from '@nestjs/common';
import { ProjectRole } from './project-member.entity';

export const ROLES_KEY = 'project_roles';

export const RequireProjectRoles = (...roles: ProjectRole[]) =>
  SetMetadata(ROLES_KEY, roles);
