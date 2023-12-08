import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ClassesController],
  providers: [ClassesService, AccessTokenStrategy],
})
export class ClassesModule {}
