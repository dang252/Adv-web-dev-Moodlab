import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CLASS_STATUS_ACTIVED,
  CLASS_STATUS_CLOSED,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_SUCCESS,
} from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { ClassDto, GradeDto, UpdateClassDto } from './dto';
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
  async listClasses(userId: number, userRole: string, res: Response) {
    try {
      console.log('[API GET /class]');

      // for admin
      if (userRole == 'ADMIN') {
        const classes = await this.prisma.class.findMany();

        return res.status(HttpStatus.OK).send(classes);
      }

      const classes = await this.prisma.class.findMany({
        where: {
          OR: [
            {
              teacherId: userId,
            },
            {
              students: {
                some: {
                  studentId: userId,
                },
              },
            },
          ],
          status: CLASS_STATUS_ACTIVED,
        },
        include: {
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });
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

  // [GET] /:inviteCode
  async classInfo(classInviteCode: string, userId: number, res: Response) {
    try {
      console.log('[API GET /classes/:inviteCode]');

      const checkPermission = await this.prisma.class.findFirst({
        where: {
          inviteCode: classInviteCode,
          OR: [
            {
              teacherId: userId,
            },
            {
              students: {
                some: {
                  studentId: userId,
                },
              },
            },
          ],
        },
      });

      if (checkPermission == null) {
        console.log(
          `[API GET /classes/:inviteCode] User has no permission to join class ${classInviteCode}`,
        );
        return res.status(HttpStatus.FORBIDDEN).send('No permission');
      }

      const classInfo = await this.prisma.class.findFirst({
        where: {
          inviteCode: classInviteCode,
        },
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
      console.log(
        "[API GET /classes/:inviteCode] Get class's information successfully",
      );

      const { teacherId, ...response } = classInfo;

      return res.status(HttpStatus.OK).send({
        inviteLink:
          process.env.HOST_URL + '/' + response.id + '/' + response.inviteCode,
        ...response,
      });
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:inviteCode] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:inviteCode] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [PUT] /:id
  async updateClass(
    userRole: string,
    classId: string,
    data: UpdateClassDto,
    res: Response,
  ) {
    try {
      console.log('[API PUT /classes/:id]');

      if (userRole == 'ADMIN') {
        if (
          data.status == CLASS_STATUS_ACTIVED ||
          data.status == CLASS_STATUS_CLOSED
        ) {
          await this.prisma.class.update({
            where: {
              id: parseInt(classId),
            },
            data: {
              status: {
                set: data.status,
              },
            },
          });
        }
      } else if (userRole == 'TEACHER') {
        if (data.theme != null) {
          await this.prisma.class.update({
            where: {
              id: parseInt(classId),
            },
            data: {
              theme: {
                set: data.theme,
              },
            },
          });
        }
        console.log('[API PUT /classes/:id] Change theme successfully');
      }

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /classes/:id] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /classes/:id] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/members
  async classMembers(classId: string, res: Response) {
    try {
      console.log('[API GET /classes/:id/members]');
      const classMembers = await this.prisma.class.findUnique({
        where: {
          id: parseInt(classId),
        },
        include: {
          teacher: true,
          students: {
            include: {
              student: true,
            },
          },
        },
      });

      console.log(
        `[API GET /classes/:id/members] Get members in class (id: ${classId}) successfully`,
      );

      // Filter students with role "TEACHER"
      const teachers = classMembers.students.filter(
        (student) => student.student.role === 'TEACHER',
      );

      // Remove students with role "TEACHER" from the students array
      classMembers.students = classMembers.students.filter(
        (student) => student.student.role !== 'TEACHER',
      );

      return res
        .status(HttpStatus.OK)
        .send({ classMembers, otherTeachers: teachers });
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

  // [GET] /join/:code
  async joinClass(userId: number, classInviteCode: string, res: Response) {
    try {
      console.log('[API GET /classes/:id/:code]');

      // Check if user has been in this class
      const user = await this.prisma.grade.findFirst({
        where: {
          studentId: userId,
        },
        include: {
          class: true,
        },
      });

      if (user != null) {
        console.log(
          `[API GET /classes/:id/:code] User (id: ${userId}) has been in this class`,
        );

        // return res.redirect(
        //   process.env.CLIENT_HOME_PAGE + `/classes/${classId}`,
        // );
        return (
          res
            // .status(HttpStatus.CONFLICT)
            .status(HttpStatus.OK)
            .send('User has been in this class')
        );
      }

      // Check match classID, classInviteCode
      const _class = await this.prisma.class.findFirst({
        where: {
          inviteCode: classInviteCode,
        },
      });

      if (_class == null) {
        console.log("[API GET /classes/:id/:code] invite code doesn't exist");

        // return res.redirect(process.env.CLIENT_HOME_PAGE);
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('The invite link is not exist');
      }

      // Create a new grade from userId and classID
      await this.prisma.grade.create({
        data: {
          studentId: userId,
          classId: _class.id,
        },
      });

      console.log(
        `[API GET /classes/:id/:code] Create a grade for studentId = ${userId} and classId = ${_class.id} successfully`,
      );

      // return res.redirect(
      //   process.env.CLIENT_HOME_PAGE + `/dashboard/classes/${classId}`,
      // );
      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:id/:code] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:id/:code] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /:id/invite
  async inviteByEmail(
    classId: string,
    userId: number,
    email: string,
    res: Response,
  ) {
    try {
      console.log('[API POST /classes/:id/invite]');

      const checkPermission = await this.prisma.class.findFirst({
        where: {
          id: parseInt(classId),
          teacherId: userId,
        },
      });

      if (checkPermission == null) {
        console.log(
          `[API POST /classes/:id/invite] User (id: ${userId} can\'t invite other by email`,
        );
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send('User has no permission to invite other by email');
      }

      console.log(
        '[API POST /classes/:id/invite] Prepare for sending email to join class',
      );
      await this.mailerService.sendMail({
        to: email,
        subject: 'Join class by email',
        template: './join_class',
        context: {
          inviteLink:
            process.env.CLIENT_HOME_PAGE +
            '/classes/' +
            checkPermission.inviteCode,
        },
      });

      console.log(
        '[API POST /classes/:id/invite] Send email Join class successfully',
      );

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API POST /classes/invite] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API POST /classes/:id/invite] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/grades
  async getListGradeCompositions(classId: string, res: Response) {
    try {
      console.log('[API GET /classes/:id/grades]');
      const listGradeCompositions = await this.prisma.gradeComposition.findMany(
        {
          where: {
            classId: parseInt(classId),
          },
          include: {
            exams: true,
          },
        },
      );

      return res
        .status(HttpStatus.OK)
        .send(listGradeCompositions.sort((a, b) => a.position - b.position));
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:id/grade] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:id/grade] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [PUT] /:id/grades
  async updateGrades(
    classId: string,
    userId: number,
    grades: GradeDto[],
    res: Response,
  ) {
    try {
      console.log('[API PUT /classes/:id/grades]');

      const checkPermission = await this.prisma.class.findFirst({
        where: {
          id: parseInt(classId),
          teacherId: userId,
        },
      });

      if (checkPermission == null) {
        console.log(
          `[API PUT /classes/:id/grades] User (id: ${userId} can\'t change grades scale`,
        );
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send('User has no permission to change grades scale');
      }

      console.log(
        `[API PUT /classes/:id/grades] Get all compositions in class (id: ${classId})`,
      );
      let listGradeCompositions = await this.prisma.gradeComposition.findMany({
        where: {
          classId: parseInt(classId),
        },
      });

      for (let i = 0; i < grades.length; i++) {
        let grade = grades[i];

        const isExistComposition = listGradeCompositions.some(
          (composition) => composition.id === grade.gradeCompositionId,
        );

        if (isExistComposition) {
          console.log(
            `[API PUT /classes/:id/grades] Composition ${grade.gradeCompositionId} is exist -> update: \n\t{\n\t\tposition: ${grade.position},\n\t\tname: ${grade.name},\n\t\tscale: ${grade.scale},\n\t}`,
          );
          listGradeCompositions = listGradeCompositions.filter(
            (item) => item.id !== grade.gradeCompositionId,
          );

          const updatedComposition = await this.prisma.gradeComposition.update({
            data: {
              position: grade.position,
              name: grade.name,
              scale: grade.scale,
            },
            where: {
              id: grade.gradeCompositionId,
            },
            include: {
              exams: true,
            },
          });

          if (grade.exams != null) {
            let upsertRecords = [];

            for (const exam of grade.exams) {
              try {
                // update when exam exists
                await this.prisma.exam.update({
                  data: {
                    gradeCompositionId: updatedComposition.id,
                    name: exam.name,
                    dueDate: exam.dueDate,
                    position: exam.position,
                    isFinalized: exam.isFinalized,
                  },
                  where: {
                    id: exam.id,
                  },
                });
              } catch (error) {
                // create new one when exam doesn't exist
                await this.prisma.exam.create({
                  data: {
                    gradeCompositionId: updatedComposition.id,
                    name: exam.name,
                    dueDate: exam.dueDate,
                    position: exam.position,
                    isFinalized: exam.isFinalized,
                  },
                });
              }

              upsertRecords.push(exam.id);
            }

            if (upsertRecords.length < updatedComposition.exams.length) {
              updatedComposition.exams.forEach(async (exam) => {
                const isUpsertedExam = upsertRecords.some(
                  (record) => record === exam.id,
                );

                if (!isUpsertedExam) {
                  await this.prisma.exam.delete({
                    where: {
                      id: exam.id,
                    },
                  });
                }
              });
            }
          }
        } else {
          console.log(
            `[API PUT /classes/:id/grades] Composition ${grade.gradeCompositionId} is not exist -> insert: \n\t{\n\tclassId: ${classId},\n\t\tposition: ${grade.position},\n\t\tname: ${grade.name},\n\t\tscale: ${grade.scale},\n\t}`,
          );

          const newGrade = await this.prisma.gradeComposition.create({
            data: {
              classId: parseInt(classId),
              position: grade.position,
              name: grade.name,
              scale: grade.scale,
            },
          });
          console.log('New grade: ', newGrade);
        }
      }

      console.log(
        `[API PUT /classes/:id/grades] List of compositions need to delete:`,
      );
      console.log('\t[');
      for (let i = 0; i < listGradeCompositions.length; i++) {
        let composition = listGradeCompositions[i];

        console.log(
          `\t\t{\n\t\t\tid: ${composition.id},\n\t\t\tclassId: ${composition.classId},\n\t\t\tposition: ${composition.position},\n\t\t\tname: ${composition.name},\n\t\t\tscale: ${composition.scale},\n\t\t},`,
        );
        await this.prisma.gradeComposition.delete({
          where: {
            id: composition.id,
          },
        });
      }
      console.log('\t]');

      const result = await this.prisma.gradeComposition.findMany({
        where: {
          classId: parseInt(classId),
        },
        include: {
          exams: true,
        },
      });

      return res.status(HttpStatus.OK).send({
        compositions: result.sort((a, b) => a.position - b.position),
      });
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /classes/:id/grades] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /classes/:id/grades] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/points
  async showStudentPoints(classId: string, studentId: number, res: Response) {
    try {
      console.log('[API GET /classes/:id/points]');

      const points = await this.prisma.grade.findFirst({
        where: {
          studentId: studentId,
          classId: parseInt(classId),
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              points: {
                select: {
                  exam: {
                    select: {
                      name: true,
                      position: true,
                      isFinalized: true,
                      gradeComposition: {
                        select: {
                          name: true,
                          scale: true,
                        },
                      },
                    },
                  },
                  point: true,
                },
              },
            },
          },
        },
      });

      let totalPoint = 0;
      let prevGrade = '';
      let prevScale = 1;
      let prevNumberOfPoints = 0;
      let compositions = [];
      points.student.points.forEach(async (point) => {
        if (point.exam.gradeComposition.name != prevGrade) {
          compositions.push({
            grade: prevGrade,
            scale: prevScale,
            totalPoint: totalPoint,
            numberOfPoints: prevNumberOfPoints,
          });

          totalPoint = 0;
          prevGrade = point.exam.gradeComposition.name;
          prevScale = point.exam.gradeComposition.scale;
          prevNumberOfPoints = 0;
        }

        totalPoint += point.point;
        prevNumberOfPoints++;
      });

      compositions.push({
        grade: prevGrade,
        scale: prevScale,
        totalPoint: totalPoint,
        numberOfPoints: prevNumberOfPoints,
      });

      let overall = 0;
      compositions.forEach((composition) => {
        if (composition.numberOfPoints != 0) {
          overall +=
            ((composition.totalPoint / composition.numberOfPoints) *
              composition.scale) /
            100;
        }
      });

      await this.prisma.grade.update({
        data: {
          overall: overall,
        },
        where: {
          id: points.id,
        },
      });

      points.overall = overall;

      return res.status(HttpStatus.OK).send(points);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:id/points] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:id/points] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/points
  async showStudentsPoints(classId: string, res: Response) {
    try {
      console.log('[API GET /classes/:id/points]');

      let listPoints = await this.prisma.grade.findMany({
        where: {
          classId: parseInt(classId),
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              points: {
                select: {
                  exam: {
                    select: {
                      name: true,
                      position: true,
                      isFinalized: true,
                      gradeComposition: {
                        select: {
                          name: true,
                          scale: true,
                        },
                      },
                    },
                  },
                  point: true,
                },
              },
              role: true,
            },
          },
        },
      });

      listPoints = listPoints.filter(
        (student) => student.student.role !== 'TEACHER',
      );

      for (const points of listPoints) {
        let totalPoint = 0;
        let prevGrade = '';
        let prevScale = 1;
        let prevNumberOfPoints = 0;
        let compositions = [];
        points.student.points.forEach(async (point) => {
          if (point.exam.gradeComposition.name != prevGrade) {
            compositions.push({
              grade: prevGrade,
              scale: prevScale,
              totalPoint: totalPoint,
              numberOfPoints: prevNumberOfPoints,
            });

            totalPoint = 0;
            prevGrade = point.exam.gradeComposition.name;
            prevScale = point.exam.gradeComposition.scale;
            prevNumberOfPoints = 0;
          }

          totalPoint += point.point;
          prevNumberOfPoints++;
        });

        compositions.push({
          grade: prevGrade,
          scale: prevScale,
          totalPoint: totalPoint,
          numberOfPoints: prevNumberOfPoints,
        });

        let overall = 0;
        compositions.forEach((composition) => {
          if (composition.numberOfPoints != 0) {
            overall +=
              ((composition.totalPoint / composition.numberOfPoints) *
                composition.scale) /
              100;
          }
        });

        await this.prisma.grade.update({
          data: {
            overall: overall,
          },
          where: {
            id: points.id,
          },
        });

        points.overall = overall;
      }
      return res.status(HttpStatus.OK).send(listPoints);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:id/points] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:id/points] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:id/reviews
  async showAllReviews(classId: string, res: Response) {
    try {
      console.log('[API GET /classes/:id/reviews]');

      const reviews = await this.prisma.review.findMany({
        where: {
          exam: {
            gradeComposition: {
              classId: parseInt(classId),
            },
          },
        },
        include: {
          exam: {
            include: {
              points: true,
            },
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          comments: true,
        },
      });

      return res.status(HttpStatus.OK).send({ reviews: reviews });
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /classes/:id/reviews] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /classes/:id/reviews] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
