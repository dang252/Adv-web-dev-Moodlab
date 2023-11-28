import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AccountDto, RefreshDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AccountDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout/:id')
  @HttpCode(HttpStatus.OK)
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh/:id')
  @HttpCode(HttpStatus.OK)
  refresh(@Param('id') id: string, @Body() dto: RefreshDto) {
    return this.authService.refresh(id, dto.refresh_token);
  }
}