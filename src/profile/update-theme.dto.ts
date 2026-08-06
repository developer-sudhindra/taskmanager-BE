import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateThemeDto {
  @IsNotEmpty()
  theme: 'LIGHT' | 'DARK';
}
