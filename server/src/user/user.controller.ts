import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_FORBIDDEN,
} from 'src/constants';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserDto } from './dto';

@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private userService: UserService) {}

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
  getProfile(@Req() req: Request, @Res() res: Response) {
    return this.userService.getProfile(req.user['sub'], res);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Gia Bao',
        },
        last_name: {
          type: 'string',
          example: 'Tran',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: HTTP_MSG_SUCCESS,
  })
  @ApiResponse({
    status: 403,
    description: HTTP_MSG_FORBIDDEN,
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  updateProfile(
    @Body() userInfo: UserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.userService.updateProfile(req.user['sub'], userInfo, res);
  }
}
