import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../tasks/tasks.model';
export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  assigneeId: string;

  @IsString()
  @IsNotEmpty()
  parentTaskId: string;
}
