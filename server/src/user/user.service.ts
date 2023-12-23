import {
  Get,
  HttpStatus,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_NOTFOUND,
} from 'src/constants';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // [GET] /
  async getProfile(userId: number, res: Response) {
    try {
      console.log('[API /user]');
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
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
  async updateProfile(userId: number, userInfo: UserDto, res: Response) {
    try {
      console.log('[API PUT /user]');
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName: userInfo.first_name,
          lastName: userInfo.last_name,
        },
      });

      if (user == null) {
        console.log('[API PUT /user] Not found user');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
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
