import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { PointDto } from './dto';

@Controller('/exam')
@ApiTags('/exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:examId')
  @ApiOperation({ summary: 'get grade board of an exam' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  getExamGrade(@Param('examId') examId: string, @Res() res: Response) {
    return this.examService.getExamGrade(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/:examId')
  @ApiOperation({ summary: 'update grade board of an exam' })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentId: {
            type: 'number',
          },
          point: {
            type: 'number',
          },
        },
      },
      example: [
        {
          studentId: 2,
          point: 7.5,
        },
        {
          studentId: 3,
          point: 8.5,
        },
        {
          studentId: 4,
          point: 9.5,
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  updateExamGrade(
    @Param('examId') examId: string,
    @Body() points: PointDto[],
    @Res() res: Response,
  ) {
    return this.examService.updateExamGrade(examId, points, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:examId/review')
  @ApiOperation({ summary: 'students request for a grade review of an exam' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  createReview(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.createReview(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:examId/review/:reviewId')
  @ApiOperation({ summary: 'show a grade review of an exam' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  showReview(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.showReview(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/:examId/review/:reviewId')
  @ApiOperation({ summary: 'make final decision for review' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  updateReview(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.updateReview(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:examId/review/:reviewId/comments')
  @ApiOperation({ summary: 'get comments in a review' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  getComments(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.getComments(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:examId/review/:reviewId/comments')
  @ApiOperation({ summary: 'add comment in a review' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  addComment(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.addComment(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:examId/reviews')
  @ApiOperation({ summary: 'show all reviews in a class' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  getAllReviews(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.getAllReviews(examId, res);
  }
}
