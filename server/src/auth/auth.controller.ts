import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/auth/login')
  login() {
    this.authService.login();
  }

  @Post('/auth/register')
  register(@Body() dto: AuthDto): Promise<Tokens> {
    this.authService.register(dto);
  }

  @Post('/auth/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/auth/refresh')
  refresh() {
    this.authService.refresh();
  }
}
