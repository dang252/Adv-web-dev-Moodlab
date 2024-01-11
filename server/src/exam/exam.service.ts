import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_NOTFOUND,
  REVIEW_STATUS_OPENED,
  HTTP_MSG_BAD_REQUEST,
} from 'src/constants';
import { PointDto, ReviewDto } from './dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  // [GET] /:examId
  async getExamGrade(examId: string, res: Response) {
    try {
      console.log('[API GET /exam/:examId]');

      const exam = await this.prisma.exam.findFirst({
        where: {
          id: parseInt(examId),
        },
        include: {
          points: {
            include: {
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  studentId: true,
                },
              },
            },
          },
        },
      });

      if (exam == null) {
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      return res.status(HttpStatus.OK).send(exam);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /exam/:examId] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /exam/:examId] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [PUT] /:examId
  async updateExamGrade(examId: string, points: PointDto[], res: Response) {
    try {
      console.log('[API PUT /exam/:examId]');

      for (let i = 0; i < points.length; i++) {
        let point = points[i];
        const updatedPoint = await this.prisma.point.update({
          where: {
            studentId_examId: {
              studentId: point.studentId,
              examId: parseInt(examId),
            },
          },
          data: {
            point: point.point,
          },
        });

        if (updatedPoint == null) {
          await this.prisma.point.create({
            data: {
              studentId: point.studentId,
              examId: parseInt(examId),
              point: point.point,
            },
          });
        }
      }

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /exam/:examId] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /exam/:examId] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /:examId/review
  async createReview(
    examId: string,
    userId: number,
    review: ReviewDto,
    res: Response,
  ) {
    try {
      console.log('[API POST /exam/:examId/review]');

      const newReview = await this.prisma.review.create({
        data: {
          examId: parseInt(examId),
          reporterId: userId,
          expectationPoint: review.expectationPoint,
          explaination: review.explaination,
          status: REVIEW_STATUS_OPENED,
        },
      });

      if (newReview == null) {
        return res.status(HttpStatus.BAD_REQUEST).send(HTTP_MSG_BAD_REQUEST);
      }

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API POST /exam/:examId/review] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API POST /exam/:examId/review] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:examId/review/:reviewId
  async showReview(examId: string, res: Response) {
    try {
      console.log('[API GET /exam/:examId/review/:reviewId]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /exam/:examId/review/:reviewId] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /exam/:examId/review/:reviewId] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:examId/reviews
  async getAllReviewsInExam(examId: string, res: Response) {
    try {
      console.log('[API GET /exam/:examId/reviews]');

      const reviews = await this.prisma.review.findMany({
        where: {
          examId: parseInt(examId),
        },
        include: {
          exam: {
            include: {
              points: {
                include: {
                  student: {
                    select: {
                      // firstName: true,
                      // lastName: true,
                      // email: true,
                      studentId: true,
                    },
                  },
                },
              },
            },
          },
          reporter: true,
          comments: true,
        },
      });
      return res.status(HttpStatus.OK).send(reviews);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /exam/:examId/reviews] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /exam/:examId/reviews] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
