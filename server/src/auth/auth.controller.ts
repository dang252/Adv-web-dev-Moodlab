import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AccountDto, RefreshDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_SUCCESS,
} from 'src/constants';

@Controller('auth')
@ApiTags('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: '20120434',
        },
        password: {
          type: 'string',
          example: '20120434',
        },
        first_name: {
          type: 'string',
          example: 'Bao',
        },
        last_name: {
          type: 'string',
          example: 'Tran Gia',
        },
        email: {
          type: 'string',
          example: '20120434@student.hcmus.edu.vn',
        },
        role: {
          type: 'string',
          example: 'STUDENT',
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
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  register(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.register(dto, res);
  }

  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: '20120434',
        },
        password: {
          type: 'string',
          example: '20120434',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
        refresh_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 404,
    description: "Account doesn't exist",
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  login(@Body() dto: AccountDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout/:id')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  logout(@Param('id') id: string, @Res() res: Response) {
    return this.authService.logout(id, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh/:id')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
        refresh_token: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          example: '...',
        },
      },
    },
  })
  refresh(
    @Param('id') id: string,
    @Body() dto: RefreshDto,
    @Res() res: Response,
  ) {
    return this.authService.refresh(id, dto.refresh_token, res);
  }

  @Get('/verify/:type/:email/:token')
  verify(
    @Param('type') type: string,
    @Param('email') email: string,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    return this.authService.verifyEmail(type, email, token, res);
  }

  @Post('/forgot_password')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: HTTP_MSG_SUCCESS,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: '20120434@student.hcmus.edu.vn',
        },
      },
    },
  })
  forgotPassword(@Body() email: string, @Res() res: Response) {
    return this.authService.forgotPassword(email, res);
  }

  @Post('/reset_password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: '20120434',
        },
        new_password: {
          type: 'string',
          example: '20120434',
        },
        token: {
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
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: HTTP_MSG_INTERNAL_SERVER_ERROR,
  })
  resetPassword(
    @Body() email: string,
    @Body() new_password: string,
    @Body() token: string,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(email, new_password, token, res);
  }
}
