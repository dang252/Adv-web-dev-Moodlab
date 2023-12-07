import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import {
  HTTP_MSG_SUCCESS,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
} from 'src/constants';
import { AuthService } from './auth.service';
import { AuthDto, AccountDto, EmailDto, ResetPasswordDto } from './dto';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
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

  @Post('login')
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
  @UseGuards(AccessTokenGuard)
  @Post('logout')
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
  logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req.user['sub'], res);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
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
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(
      req.user['sub'],
      req.user['refreshToken'],
      res,
    );
  }

  @Get('verify/:type/:id')
  verify(
    @Param('type') type: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    this.authService.verifyEmail(type, id, res);
  }

  @Post('forgot_password')
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
  forgotPassword(@Body() dto: EmailDto, @Res() res: Response) {
    return this.authService.forgotPassword(dto.email, res);
  }

  @Post('reset_password')
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
  resetPassword(@Body() dto: ResetPasswordDto, @Res() res: Response) {
    // return this.authService.resetPassword(userId, new_password, token, res);
    return this.authService.resetPassword(dto.id, dto.new_password, res);
  }
}
