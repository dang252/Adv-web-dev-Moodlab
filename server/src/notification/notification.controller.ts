import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';
import { NotificationDto, UpdateStatusNotificationDto } from './dto';

@Controller('notification')
@ApiTags('/notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  getNotifications(@Req() req: Request, @Res() res: Response) {
    return this.notificationService.getNotifications(req.user['sub'], res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reporterId: {
          type: 'number',
          example: 1,
        },
        receiversId: {
          type: 'number',
          example: [2, 3],
        },
        postId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  createNotification(
    @Body() notificationInfo: NotificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.notificationService.createNotification(
      req.user['sub'],
      notificationInfo,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notificationId: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  updateNotifications(
    @Body() data: UpdateStatusNotificationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.notificationService.updateNotifications(
      req.user['sub'],
      data.notificationId,
      res,
    );
  }
}
