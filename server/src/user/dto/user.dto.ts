import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  status: string;
}
