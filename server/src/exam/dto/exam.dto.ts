import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ExamDto {
  @IsNumber()
  id: number;

  @IsNumber()
  gradeCompositionId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @IsBoolean()
  isFinalized: boolean;
}
