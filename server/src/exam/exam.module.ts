import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ExamController],
  providers: [ExamService, AccessTokenStrategy],
})
export class ExamModule {}
