import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CLASS_STATUS_ACTIVED,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_SUCCESS,
} from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { ClassDto } from './dto';
import { MailerService } from '@nest-modules/mailer';

const classCodeLength = 6;

@Injectable()
export class ClassesService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

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
      console.log('[API GET /class]');

      const classes = await this.prisma.class.findMany();
      console.log('[API GET /class] Get list classes successfully');

      return res.status(HttpStatus.OK).send(classes);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /class] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /class] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /
  async createClass(req: Request, res: Response, classInfo: ClassDto) {
    try {
      console.log('[API POST /class]');
      const user = { id: req.user['sub'], role: req.user['role'] };

      if (user.role == 'STUDENT') {
        console.log('[API POST /class] User has no permission to create class');
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
        console.log('[API POST /class] Create a new class successfully');

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
        console.log(
          `[API POST /class] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API POST /class] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id
  async classInfo(classId: string, res: Response) {
    try {
      console.log('[API GET /class/:id]');

      const classInfo = await this.prisma.class.findUnique({
        where: {
          id: parseInt(classId),
        },
      });
      console.log("[API GET /class/:id] Get class's information successfully");

      return res.status(HttpStatus.OK).send(classInfo);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /class/:id] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /class/:id] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/members
  async classMembers(classId: string, res: Response) {
    try {
      console.log('[API GET /class/:id/members]');
      const classMembers = await this.prisma.class.findUnique({
        where: {
          id: parseInt(classId),
        },
        include: {
          teacher: true,
          students: true,
        },
      });

      console.log(
        `[API GET /class/:id/members] Get members in class (id: ${classId}) successfully`,
      );

      return res.status(HttpStatus.OK).send(classMembers);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /class:id/members] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /class:id/members] Internal error');
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
      console.log('[API /class/:id/:code]');

      // Check if user has been in this class
      const user = await this.prisma.grade.findFirst({
        where: {
          studentId: userId,
        },
      });

      if (user != null) {
        console.log(
          `[API /class/:id/:code] User (id: ${userId}) has been in this class`,
        );
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
        console.log("[API /class/:id/:code] id and invite code don't match");
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

      console.log(
        `[API /class/:id/:code] Create a grade for studentId = ${userId} and classId = ${classId} successfully`,
      );

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /class/:id/:code] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /class/:id/:code] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /invite
  async inviteByEmail(userId: number, email: string, res: Response) {
    try {
      console.log('[API POST /class/invite]');

      const checkPermission = await this.prisma.class.findFirst({
        where: {
          teacherId: userId,
        },
      });

      if (checkPermission == null) {
        console.log(
          `[API POST /class/invite] User (id: ${userId} can\'t invite other by email`,
        );
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send('User has no permission to invite other by email');
      }

      console.log(
        '[API POST /class/invite] Prepare for sending email to join class',
      );
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

      console.log(
        '[API POST /class/invite] Send email Join class successfully',
      );
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /class/invite] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /class/invite] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
