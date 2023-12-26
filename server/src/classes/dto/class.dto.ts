import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClassDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  subject: string;
}

export class InviteEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  theme: string;

  // addStudents: number[];

  // removeStudents: number[];

  // addTeachers: number[];

  // removeTeachers: number[];

  @IsOptional()
  @IsString()
  status: string;
}
