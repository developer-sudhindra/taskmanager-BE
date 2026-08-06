import { IsNotEmpty } from 'class-validator';
export class CreateCommentParams {
  @IsNotEmpty()
  taskId: string;
}
