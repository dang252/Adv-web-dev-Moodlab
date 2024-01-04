import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  @IsNumber()
  reporterId: number;

  @IsNotEmpty()
  @IsArray()
  receiversId: number[];

  @IsNotEmpty()
  @IsNumber()
  postId: number;
}

export class UpdateStatusNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  notificationId: number;

  @IsOptional()
  @IsString()
  status: string;
}
