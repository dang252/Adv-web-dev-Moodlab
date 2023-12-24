import { HttpStatus, Injectable } from '@nestjs/common';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

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
}
