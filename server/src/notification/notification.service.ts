import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  HTTP_MSG_NOTFOUND,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_SUCCESS,
} from 'src/constants';
import { Request, Response } from 'express';
import { NotificationDto } from './dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // [GET] /
  async getNotifications(userId: number, res: Response) {
    try {
      console.log('[API GET /notifications]');

      const notifications = await this.prisma.notification.findMany({
        where: {
          id: userId,
        },
      });

      if (notifications == null) {
        console.log('[API GET /notifications] Not found user');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      return res.status(HttpStatus.OK).send(notifications);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /notifications] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /notifications] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /
  async createNotification(
    userId: number,
    notiInfo: NotificationDto,
    res: Response,
  ) {
    try {
      console.log('[API POST /notifications]');

      notiInfo.receiversId.forEach(async (receiverId) => {
        await this.prisma.notification.create({
          data: {
            reporterId: userId,
            receiverId: receiverId,
            postId: notiInfo.postId,
          },
        });

        // send noti by socket
      });

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API POST /notifications] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API POST /notifications] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [PUT] /
  async updateNotifications(
    userId: number,
    notificationId: number,
    res: Response,
  ) {
    try {
      console.log('[API PUT /notifications]');

      const notifications = await this.prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          isSeen: true,
        },
      });

      if (notifications == null) {
        console.log('[API PUT /notifications] Not found user');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      return res.status(HttpStatus.OK).send(notifications);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /notifications] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /notifications] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
