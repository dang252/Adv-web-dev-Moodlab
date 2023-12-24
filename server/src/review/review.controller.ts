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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { ReviewService } from './review.service';
import { Request, Response } from 'express';

@Controller('/review')
@ApiTags('/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/review/:reviewId')
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
    return this.reviewService.updateReview(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/review/:reviewId/comments')
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
    return this.reviewService.getComments(examId, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/review/:reviewId/comments')
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
    return this.reviewService.addComment(examId, res);
  }
}
