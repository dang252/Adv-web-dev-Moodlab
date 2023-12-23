import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ExamDto } from 'src/exam/dto';

export class GradeDto {
  @IsNotEmpty()
  @IsNumber()
  gradeCompositionId: number;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  scale: number;

  exams: ExamDto[];
}
