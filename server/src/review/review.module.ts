import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ReviewController],
  providers: [ReviewService, AccessTokenStrategy],
})
export class ReviewModule {}
