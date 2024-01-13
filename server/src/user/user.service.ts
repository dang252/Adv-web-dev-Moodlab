import { HttpStatus, Injectable } from '@nestjs/common';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_NOTFOUND,
  HTTP_MSG_FORBIDDEN,
  ACCOUNT_STATUS_ACTIVED,
  ACCOUNT_STATUS_BLOCKED,
  ACCOUNT_STATUS_CLOSED,
  ACCOUNT_STATUS_PENDING,
} from 'src/constants';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  isUserStatus(status: string) {
    if (status == ACCOUNT_STATUS_PENDING) {
      return true;
    }

    if (status == ACCOUNT_STATUS_ACTIVED) {
      return true;
    }

    if (status == ACCOUNT_STATUS_BLOCKED) {
      return true;
    }

    if (status == ACCOUNT_STATUS_CLOSED) {
      return true;
    }

    return false;
  }

  // [GET] /
  async getProfile(userId: number, userRole: string, res: Response) {
    try {
      console.log('[API /user]');

      if (userRole == 'ADMIN') {
        const listUsers = await this.prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentId: true,
            role: true,
            account: {
              select: {
                username: true,
                status: true,
              },
            },
          },
        });

        return res.status(HttpStatus.OK).send(listUsers);
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          sentNotifications: true,
        },
      });

      if (user == null) {
        console.log('[API /user] Not found user');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      const { refreshToken, ...userInfo } = user;
      return res.status(HttpStatus.OK).send(userInfo);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /user] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /user] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [PUT] /
  async updateProfile(
    userId: number,
    userRole: string,
    userInfo: UserDto,
    res: Response,
  ) {
    try {
      console.log('[API PUT /user]');

      if (userInfo.first_name != null || userInfo.last_name != null) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (user == null) {
          console.log('[API PUT /user] Not found user');
          return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
        }

        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            firstName: userInfo.first_name || user.firstName,
            lastName: userInfo.last_name || user.lastName,
          },
        });
        console.log(
          "[API PUT /user] Update user's info: first_name = " +
            userInfo.first_name +
            '; last_name = ' +
            userInfo.last_name,
        );
      }

      // update student's id
      console.log(
        "[API PUT /user] Update student's id: userId = " +
          userInfo.user_id +
          '; studentId = ' +
          userInfo.student_id,
      );
      if (userInfo.student_id != null) {
        await this.prisma.user.update({
          where: {
            id: userInfo.user_id != null ? userInfo.user_id : userId,
          },
          data: {
            studentId: userInfo.student_id,
          },
        });
      }

      // for admin to change status of account
      console.log(
        "[API PUT /user] Admin update account's status: userId = " +
          userInfo.user_id +
          '; status = ' +
          userInfo.status,
      );
      if (userInfo.user_id != null && this.isUserStatus(userInfo.status)) {
        if (userRole == 'ADMIN') {
          if (userInfo.status != '') {
            await this.prisma.account.update({
              where: {
                userId: userInfo.user_id,
              },
              data: {
                status: userInfo.status,
              },
            });
          }
          console.log(
            '[API PUT /user] Get account by user_id to update status successfully',
          );

          if (userInfo.student_id != '') {
            await this.prisma.user.update({
              where: {
                id: userInfo.user_id,
              },
              data: {
                studentId: userInfo.student_id,
              },
            });
          }
          console.log(
            '[API PUT /user] Get user by user_id to update student_id successfully',
          );
        } else {
          return res.status(HttpStatus.FORBIDDEN).send(HTTP_MSG_FORBIDDEN);
        }
      }

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /user] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /user] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
