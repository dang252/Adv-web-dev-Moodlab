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
import { PointDto, ReviewDto } from './dto';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        expectationPoint: {
          type: 'number',
          example: 10,
        },
        explaination: {
          type: 'string',
          example: 'Bài em làm đúng mà?',
        },
      },
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
  createReview(
    @Param('examId') examId: string,
    @Body() review: ReviewDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.createReview(examId, req.user['sub'], review, res);
  }

  // @ApiBearerAuth()
  // @UseGuards(AccessTokenGuard)
  // @Get('/:examId/review/:reviewId')
  // @ApiOperation({ summary: 'show a grade review of an exam' })
  // @ApiResponse({
  //   status: 200,
  //   schema: {
  //     type: 'string',
  //     example: HTTP_MSG_SUCCESS,
  //   },
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: HTTP_MSG_FORBIDDEN,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  // })
  // showReview(
  //   @Param('examId') examId: string,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   return this.examService.showReview(examId, res);
  // }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:examId/reviews')
  @ApiOperation({ summary: 'show all reviews of an exam' })
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
  getAllReviewsInExam(
    @Param('examId') examId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.examService.getAllReviewsInExam(examId, res);
  }
}
