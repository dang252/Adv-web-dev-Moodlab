import { HttpStatus, Injectable } from '@nestjs/common';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  REVIEW_STATUS_CLOSED,
} from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { FinalDecisionDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // [PUT] /review/:reviewId
  async updateReview(
    reviewId: string,
    finalDecision: FinalDecisionDto,
    res: Response,
  ) {
    try {
      console.log('[API PUT /review/:reviewId]');

      const updatedReview = await this.prisma.review.update({
        data: {
          status: REVIEW_STATUS_CLOSED,
        },
        where: {
          id: parseInt(reviewId),
        },
      });

      await this.prisma.point.update({
        data: {
          point: finalDecision.newPoint,
        },
        where: {
          studentId_examId: {
            examId: updatedReview.examId,
            studentId: finalDecision.studentId,
          },
        },
      });

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API PUT /review/:reviewId] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API PUT /review/:reviewId] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /review/:reviewId/comments
  async getComments(reviewId: string, res: Response) {
    try {
      console.log('[API GET /review/:reviewId/comments]');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API GET /review/:reviewId/comments] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API GET /review/:reviewId/comments] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /review/:reviewId/comment
  async addComment(
    reviewId: string,
    userId: number,
    content: string,
    res: Response,
  ) {
    try {
      console.log('[API POST /review/:reviewId/comments]');

      const newComment = await this.prisma.comment.create({
        data: {
          reviewId: parseInt(reviewId),
          userId: userId,
          content: content,
        },
      });

      return res.status(HttpStatus.OK).send(newComment);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API POST /review/:reviewId/comments] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
        // return res.redirect(process.env.CLIENT_HOME_PAGE);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API POST /review/:reviewId/comments] Internal error');
      // return res.redirect(process.env.CLIENT_HOME_PAGE);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
