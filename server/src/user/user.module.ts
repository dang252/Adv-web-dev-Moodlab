import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy],
})
export class UserModule {}
