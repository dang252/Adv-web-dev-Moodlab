import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CLASS_STATUS_ACTIVED,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_SUCCESS,
} from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { ClassDto } from './dto';

const classCodeLength = 6;

@Injectable()
export class ClassesService {
  mailerService: any;
  constructor(private prisma: PrismaService) {}

  // Generate class's code
  generateClassCode(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

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
            teacherId: user.id,
            inviteCode: this.generateClassCode(classCodeLength),
            status: CLASS_STATUS_ACTIVED,
          },
        });

        return res.status(HttpStatus.OK).send({
          inviteLink:
            process.env.HOST_URL +
            '/' +
            newClass.id +
            '/' +
            newClass.inviteCode,
          ...newClass,
        });
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

  // [GET] /:id/:code
  async joinClass(
    userId: number,
    classId: string,
    classInviteCode: string,
    res: Response,
  ) {
    try {
      // Check if user has been in this class
      const user = await this.prisma.grade.findFirst({
        where: {
          studentId: userId,
        },
      });

      if (user != null) {
        return res
          .status(HttpStatus.CONFLICT)
          .send('User has been in this class');
      }

      // Check match classID, classInviteCode
      const _class = await this.prisma.class.findFirst({
        where: {
          id: parseInt(classId),
          inviteCode: classInviteCode,
        },
      });

      if (_class == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('The invite link is not exist');
      }

      // Create a new grade from userId and classID
      await this.prisma.grade.create({
        data: {
          studentId: userId,
          classId: parseInt(classId),
          overall: 0,
          isFinalized: false,
        },
      });

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
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

  // [POST] /invite
  async inviteByEmail(userId: number, email: string, res: Response) {
    try {
      const checkPermission = await this.prisma.class.findFirst({
        where: {
          teacherId: userId,
        },
      });

      if (checkPermission == null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send('User has no permission to invite other by email');
      }

      await this.mailerService.sendMail({
        to: email,
        subject: 'Join class by email',
        template: './join_class',
        context: {
          inviteLink:
            process.env.HOST_URL +
            '/class/' +
            checkPermission.id +
            '/' +
            checkPermission.inviteCode,
        },
      });
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
