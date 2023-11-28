import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AccountDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/auth/register')
  register(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Post('/auth/login')
  login(@Body() dto: AccountDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('/auth/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/auth/refresh')
  refresh() {
    return this.authService.refresh();
  }
}
