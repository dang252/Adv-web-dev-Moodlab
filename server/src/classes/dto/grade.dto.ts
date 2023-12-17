import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GradeDto {
  @IsNotEmpty()
  @IsNumber()
  grade_id: number;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  scale: number;
}
