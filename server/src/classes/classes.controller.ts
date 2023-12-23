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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_FORBIDDEN,
} from 'src/constants';
import { ClassesService } from './classes.service';
import { Request, Response } from 'express';
import { ChangeTheme, ClassDto, GradeDto, InviteEmailDto } from './dto';

@Controller('classes')
@ApiTags('/classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
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
  listClasses(@Req() req: Request, @Res() res: Response) {
    return this.classesService.listClasses(req.user['sub'], res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: 'CSC13003',
        },
        name: {
          type: 'string',
          example: 'Kiem thu phan mem',
        },
        subject: {
          type: 'string',
          example: '20_3',
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
  createClass(
    @Req() req: Request,
    @Res() res: Response,
    @Body() classIfo: ClassDto,
  ) {
    return this.classesService.createClass(req, res, classIfo);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:inviteCode')
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
  classInfo(
    @Param('inviteCode') inviteCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.classesService.classInfo(inviteCode, req.user['sub'], res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          example: '20120434',
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
  changeTheme(
    @Param('id') id: string,
    @Body() dto: ChangeTheme,
    @Res() res: Response,
  ) {
    return this.classesService.changeTheme(id, dto.theme, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:id/members')
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
  classMembers(@Param('id') id: string, @Res() res: Response) {
    return this.classesService.classMembers(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/join/:code')
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
  joinClass(
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.classesService.joinClass(req.user['sub'], code, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:id/invite')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: '20120434',
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
  inviteByEmail(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: InviteEmailDto,
  ) {
    return this.classesService.inviteByEmail(
      id,
      req.user['sub'],
      dto.email,
      res,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('/:id/grades')
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
  getListGradeCompositions(@Param('id') id: string, @Res() res: Response) {
    return this.classesService.getListGradeCompositions(id, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put('/:id/grades')
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          grade_id: { type: 'number' },
          position: { type: 'number' },
          name: { type: 'string' },
          scale: { type: 'number' },
        },
      },
      example: [
        {
          grade_id: 1,
          position: 0,
          name: 'BTCN',
          scale: 20,
        },
        {
          grade_id: 2,
          position: 1,
          name: 'GK',
          scale: 30,
        },

        {
          grade_id: 3,
          position: 2,
          name: 'CK',
          scale: 50,
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
  changeGradesScale(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GradeDto[],
  ) {
    return this.classesService.changeGradesScale(id, req.user['sub'], dto, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:id/points')
  @ApiBody({})
  showStudentPoints(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GradeDto[],
  ) {
    // return this.classesService.showStudentPoints(id, req.user['sub'], dto, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/:id/reviews')
  @ApiBody({})
  showAllReviews(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GradeDto[],
  ) {
    // return this.classesService.showAllReviews(id, req.user['sub'], dto, res);
  }
}
