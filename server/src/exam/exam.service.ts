import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_NOTFOUND,
} from 'src/constants';

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
  async updateExamGrade(examId: string, res: Response) {
    try {
      console.log('[API PUT /exam/:examId]');

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
  async createReview(examId: string, res: Response) {
    try {
      console.log('[API POST /exam/:examId/review]');

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

  // [PUT] /:examId/review/:reviewId
  async updateReview(examId: string, res: Response) {
    try {
      console.log('[API PUT /exam/:examId/review/:reviewId]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /exam/:examId/review/:reviewId] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /exam/:examId/review/:reviewId] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:examId/review/:reviewId/comments
  async getComments(examId: string, res: Response) {
    try {
      console.log('[API GET /exam/:examId/review/:reviewId/comments]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /exam/:examId/review/:reviewId/comments] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log(
        '[API GET /exam/:examId/review/:reviewId/comments] Internal error',
      );
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /:examId/review/:reviewId/comments
  async addComment(examId: string, res: Response) {
    try {
      console.log('[API POST /exam/:examId/review/:reviewId/comments]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API POST /exam/:examId/review/:reviewId/comments] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log(
        '[API POST /exam/:examId/review/:reviewId/comments] Internal error',
      );
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /:examId/reviews
  async getAllReviews(examId: string, res: Response) {
    try {
      console.log('[API GET /exam/:examId/reviews]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
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
