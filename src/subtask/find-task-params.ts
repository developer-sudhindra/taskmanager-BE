import { IsNotEmpty, IsString } from 'class-validator';

export class FindTaskParams {
  @IsNotEmpty()
  @IsString()
  taskId: string;
}
