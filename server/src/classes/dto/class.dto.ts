import { IsNotEmpty, IsString } from 'class-validator';

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

export class ChangeTheme {
  @IsNotEmpty()
  @IsString()
  theme: string;
}
