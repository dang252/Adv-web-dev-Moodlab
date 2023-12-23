import {
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
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';

@Controller('/exam')
@ApiTags('/exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':/examId')
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
  getExamGrade(
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.getExamGrade();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put(':/examId')
  @ApiOperation({ summary: 'update grade board of an exam' })
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.updateExamGrade();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post(':/examId/review')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.createReview();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':/examId/review/:reviewId')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.showReview();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put(':/examId/review/:reviewId')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.updateReview();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':/examId/review/:reviewId/comments')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.getComments();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post(':/examId/review/:reviewId/comments')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.addComment();
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post(':/examId/reviews')
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
    @Param('examId') type: Number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // return this.examService.getAllReviews();
  }
}
