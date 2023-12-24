import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsNumber()
  expectationPoint: number;

  @IsNotEmpty()
  @IsString()
  explaination: string;
}
