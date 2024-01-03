import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [NotificationController],
  providers: [NotificationService, AccessTokenStrategy],
})
export class NotificationModule {}
