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
import { ChangeTheme, ClassDto, InviteEmailDto } from './dto';

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
  @Get('/:id')
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
  classInfo(@Param('id') id: string, @Res() res: Response) {
    return this.classesService.classInfo(id, res);
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
  @Get('/:id/:code')
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
    @Param('id') id: string,
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.classesService.joinClass(req.user['sub'], id, code, res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/invite')
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
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: InviteEmailDto,
  ) {
    return this.classesService.inviteByEmail(req.user['sub'], dto.email, res);
  }
}
