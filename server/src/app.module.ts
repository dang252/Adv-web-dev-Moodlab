import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ClassesModule } from './classes/classes.module';
import { ExamModule } from './exam/exam.module';
import { ReviewModule } from './review/review.module';

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
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
