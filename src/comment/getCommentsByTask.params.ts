import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCommentsByTaskParam {
  @IsNotEmpty()
  @IsUUID()
  taskId: string;
}
