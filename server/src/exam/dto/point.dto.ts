import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PointDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  point: number;
}
