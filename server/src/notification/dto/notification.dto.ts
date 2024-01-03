import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class NotificationDto {
  @IsOptional()
  @IsNumber()
  reporterId: number;

  @IsOptional()
  @IsArray()
  receiversId: number[];

  @IsOptional()
  @IsNumber()
  postId: number;
}
