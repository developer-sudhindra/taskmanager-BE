import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProjectStatus } from './project.model';

export class UpdateProjectStatusDto {
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
