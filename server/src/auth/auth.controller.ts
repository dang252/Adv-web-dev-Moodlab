import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
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

@ApiTags('/auth')
@Controller('auth')
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
      example: 'Success',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  register(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto);
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
    status: 500,
    description: 'Internal server error',
  })
  login(@Body() dto: AccountDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout/:id')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: 'Success',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
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
    description: 'Internal server error',
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
  refresh(@Param('id') id: string, @Body() dto: RefreshDto) {
    return this.authService.refresh(id, dto.refresh_token);
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
      example: 'Success',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
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
  forgotPassword(@Body() email: string) {
    return this.authService.forgotPassword(email);
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
      example: 'Success',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  resetPassword(
    @Body() email: string,
    @Body() new_password: string,
    @Body() token: string,
  ) {
    return this.authService.resetPassword(email, new_password, token);
  }
}
