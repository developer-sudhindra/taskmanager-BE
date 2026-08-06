import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from './project.model';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  @IsOptional()
  status?: ProjectStatus;
}
