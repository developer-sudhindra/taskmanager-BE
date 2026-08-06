import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindByPrjectParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  projectId: string;
}
