import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';
import { ProjectRole } from './project-member.entity';

export class AddMemberDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  @IsEnum([
    ProjectRole.ADMIN,
    ProjectRole.MEMBER,
    ProjectRole.VIEWER,
    ProjectRole.OWNER,
  ])
  role: ProjectRole;
}
