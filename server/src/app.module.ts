import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ClassesController } from './classes/classes.controller';
import { ClassesService } from './classes/classes.service';
import { ClassesModule } from './classes/classes.module';
import { ExamController } from './exam/exam.controller';
import { ExamService } from './exam/exam.service';
import { ExamModule } from './exam/exam.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No reply" <${process.env.MAIL_FROM_NAME}>`,
      },
      template: {
        dir: join(__dirname, 'src/templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    ClassesModule,
    ExamModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ClassesController,
    ExamController,
  ],
  providers: [
    AppService,
    JwtService,
    AuthService,
    UserService,
    ClassesService,
    ExamService,
  ],
})
export class AppModule {}
