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
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_FORBIDDEN,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { ReviewService } from './review.service';
import { Request, Response } from 'express';
import { FinalDecisionDto, ReviewDto } from './dto';
import { CommentDto } from './dto/comment.dto';

@Controller('/review')
@ApiTags('/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/:reviewId')
  @ApiOperation({ summary: 'make final decision for review' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'number', example: 1 },
        newPoint: { type: 'number', example: 10 },
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
  updateReview(
    @Param('reviewId') reviewId: string,
    @Body() finalDecision: FinalDecisionDto,
    @Res() res: Response,
  ) {
    return this.reviewService.updateReview(reviewId, finalDecision, res);
  }

  //   @ApiBearerAuth()
  //   @UseGuards(AccessTokenGuard)
  //   @Get('/:reviewId/comments')
  //   @ApiOperation({ summary: 'get comments in a review' })
  //   @ApiResponse({
  //     status: 200,
  //     schema: {
  //       type: 'string',
  //       example: HTTP_MSG_SUCCESS,
  //     },
  //   })
  //   @ApiResponse({
  //     status: 403,
  //     description: HTTP_MSG_FORBIDDEN,
  //   })
  //   @ApiResponse({
  //     status: 500,
  //     description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  //   })
  //   getComments(
  //     @Param('examId') examId: string,
  //     @Req() req: Request,
  //     @Res() res: Response,
  //   ) {
  //     return this.reviewService.getComments(examId, res);
  //   }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:reviewId/comment')
  @ApiOperation({ summary: 'add comment in a review' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Phần này thầy chấm nhầm, để thầy sửa',
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
  addComment(
    @Param('reviewId') reviewId: string,
    @Body() comment: CommentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.reviewService.addComment(
      reviewId,
      req.user['sub'],
      comment.content,
      res,
    );
  }
}
