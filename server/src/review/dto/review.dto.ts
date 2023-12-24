import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsNumber()
  expectationPoint: number;

  @IsNotEmpty()
  @IsString()
  explaination: string;
}

export class FinalDecisionDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  newPoint: number;
}
