import { HttpStatus, Injectable } from '@nestjs/common';
import { HTTP_MSG_INTERNAL_SERVER_ERROR } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { ClassDto } from './dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  // [GET] /
  async listClasses(userId: number, res: Response) {
    try {
      const classes = await this.prisma.class.findMany();
      return res.status(HttpStatus.OK).send(classes);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /
  async createClass(req: Request, res: Response, classInfo: ClassDto) {
    try {
      const user = { id: req.user['sub'], role: req.user['role'] };

      if (user.role == 'STUDENT') {
        return res
          .status(HttpStatus.FORBIDDEN)
          .send('User has no permission to create class');
      } else {
        const newClass = await this.prisma.class.create({
          data: {
            code: classInfo.code,
            name: classInfo.name,
            subject: classInfo.subject,
            teacherId: user.id,
            inviteCode: '',
            status: 'ACTIVE',
          },
        });

        return res.status(HttpStatus.OK).send(newClass);
      }
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id
  async classInfo(classId: string, res: Response) {
    try {
      const classInfo = await this.prisma.class.findUnique({
        where: {
          id: parseInt(classId),
        },
      });

      return res.status(HttpStatus.OK).send(classInfo);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/members
  async classMembers(classId: string, res: Response) {
    try {
      const classMembers = await this.prisma.class.findUnique({
        where: {
          id: parseInt(classId),
        },
        include: {
          teacher: true,
          students: true,
        },
      });

      return res.status(HttpStatus.OK).send(classMembers);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
