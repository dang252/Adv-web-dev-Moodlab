import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AccountDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import {
  ACCOUNT_STATUS_ACTIVED,
  ACCOUNT_STATUS_PENDING,
  EMAIL_VERIFICATION_ACTIVATE_ACCOUNT,
  EMAIL_VERIFICATION_RESET_PASSWORD,
  HTTP_MSG_INTERNAL_SERVER_ERROR,
  HTTP_MSG_NOTFOUND,
  HTTP_MSG_SUCCESS,
  HTTP_MSG_UNAUTHORIZED,
} from 'src/constants';
import { MailerService } from '@nest-modules/mailer';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  // Hash data by bcrypt lib
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  // Generate a pair of tokens: access_token and refresh_token
  async getTokens(userId: number, role: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Hash the refresh token and save to database
  async hashRefreshToken(userId: number, refreshToken: string) {
    const hashRefreshToken = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashRefreshToken,
      },
    });
  }

  // [POST] /register
  async register(dto: AuthDto, res: Response) {
    try {
      console.log('[API /auth/register]');

      // check if exist a same username/email in database
      const existedUsername = await this.prisma.account.findFirst({
        where: {
          username: dto.username,
        },
      });
      if (existedUsername != null) {
        console.log(`[API /auth/register] Username ${dto.username} existed`);
        return res
          .status(HttpStatus.FORBIDDEN)
          .send(`The username ${dto.username} existed`);
      }

      const existedEmail = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (existedEmail != null) {
        console.log(`[API /auth/register] The email ${dto.email} existed`);
        return res
          .status(HttpStatus.FORBIDDEN)
          .send(`The email ${dto.email} existed`);
      }

      // create new user in database
      const newUser = await this.prisma.user.create({
        data: {
          firstName: dto.first_name,
          lastName: dto.last_name,
          email: dto.email,
          role: dto.role,
          refreshToken: '',
        },
      });

      console.log(
        '[API /auth/register] Create a new user and save database successfully',
      );

      const hashPassword = await this.hashData(dto.password);

      // create new account
      await this.prisma.account.create({
        data: {
          userId: newUser.id,
          username: dto.username,
          password: hashPassword,
          status: ACCOUNT_STATUS_PENDING,
        },
      });

      console.log(
        '[API /auth/register] Create a new account and save database successfully',
      );

      // send email for user to activate his account (hash email and verify by email)
      console.log('[API /auth/register] Prepare for sending activate email');
      await this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Active your account',
        template: process.cwd() + '/src/templates/email/activate_email',
        context: {
          verifyUrl:
            process.env.HOST_URL +
            '/auth/verify/' +
            EMAIL_VERIFICATION_ACTIVATE_ACCOUNT +
            '/' +
            newUser.id, //+
          // '/' +
          // encodeURIComponent(hashedId),
        },
      });
      console.log('[API /auth/register] Send activate email successfully');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // Clear all data have been saved
      await this.prisma.account.delete({
        where: {
          username: dto.username,
        },
      });
      await this.prisma.user.delete({
        where: {
          email: dto.email,
        },
      });

      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/register] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/register] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /login
  async login(dto: AccountDto, res: Response) {
    try {
      console.log('[API /auth/login]');
      const account = await this.prisma.account.findUnique({
        where: {
          username: dto.username,
        },
      });
      if (!account) {
        console.log('[API /auth/login] Not found account');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      if (account.status != ACCOUNT_STATUS_ACTIVED) {
        console.log('[API /auth/login] Account is inactived');
        return res.status(HttpStatus.FORBIDDEN).send('Account is inactived');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: account.userId,
        },
      });

      const passwordMatches = await bcrypt.compare(
        dto.password,
        account.password,
      );
      if (!passwordMatches) {
        console.log("[API /auth/login] Password doesn't match");
        return res.status(HttpStatus.FORBIDDEN).send('Access Denied');
      }

      console.log('[API /auth/login] Generate tokens');
      const tokens = await this.getTokens(account.userId, user.role);
      await this.hashRefreshToken(user.id, tokens.refresh_token);

      return res.status(HttpStatus.OK).send(tokens);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/login] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/login] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /logout
  async logout(userId: number, res: Response) {
    try {
      console.log('[API /auth/logout]');
      await this.prisma.user.update({
        where: {
          id: userId,
          refreshToken: {
            not: '',
          },
        },
        data: {
          refreshToken: '',
        },
      });

      console.log('[API /auth/logout] Remove refresh token successfully');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/logout] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/logout] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /refresh
  async refresh(userId: number, refreshToken: string, res: Response) {
    try {
      console.log('[API /auth/refresh]');
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user == null) {
        console.log('[API /auth/refresh] Not found user');
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
      }

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        console.log("[API /auth/refresh] Refresh token doesn't match");
        return res.status(HttpStatus.UNAUTHORIZED).send(HTTP_MSG_UNAUTHORIZED);
      }

      const tokens = await this.getTokens(user.id, user.role);
      await this.hashRefreshToken(user.id, tokens.refresh_token);

      console.log('[API /auth/refresh] Generate tokens successfully');

      return res.status(HttpStatus.OK).send(tokens);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/refresh] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/refresh] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [GET] /verify/:type/:id
  async verifyEmail(type: string, id: string, res: Response) {
    try {
      console.log('[API /auth/verify]');

      // const hashedEmail = await this.hashData(id);
      // const emailMatches = await bcrypt.compare(hashedEmail, token);
      // if (emailMatches) {
      //   console.log('Email matches');
      if (1) {
        const user = await this.prisma.user.findFirst({
          where: {
            id: parseInt(id),
          },
        });

        if (user == null) {
          console.log('[API /auth/verify] User not found');
          return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
        }

        console.log('[API /auth/verify] User found');

        const account = await this.prisma.account.findFirst({
          where: {
            userId: parseInt(id),
          },
        });

        switch (type) {
          case EMAIL_VERIFICATION_ACTIVATE_ACCOUNT: {
            console.log('[API /auth/verify] Activate Account');

            if (account.status == ACCOUNT_STATUS_PENDING) {
              await this.prisma.account.update({
                where: {
                  userId: user.id,
                },
                data: {
                  status: ACCOUNT_STATUS_ACTIVED,
                },
              });
              console.log("[API /auth/verify] Updated account's status");

              return res.redirect(process.env.CLIENT_HOME_PAGE);
            }

            return res
              .status(HttpStatus.CONFLICT)
              .send("Account can't be activated");
          }
          case EMAIL_VERIFICATION_RESET_PASSWORD: {
            console.log('[API /auth/verify] Reset Password');

            const hashedId = await this.hashData(user.id.toString());

            return res.redirect(
              process.env.CLIENT_RESET_PASSWORD_PAGE + '/' + user.id.toString(), // +
              // '/' +
              // hashedId,
            );
          }
          default: {
            return res.redirect(process.env.CLIENT_HOME_PAGE);
          }
        }
      }
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/verify] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/verify] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /forgot_password
  async forgotPassword(email: string, res: Response) {
    try {
      console.log('[API /auth/forgot_password]');
      // need refactor
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      console.log('[API /auth/forgot_password] Not found user');

      console.log(
        '[API /auth/forgot_password] Prepare for sending reset password email',
      );
      const hashedEmail = await this.hashData(email);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        template: './reset_password',
        context: {
          verifyUrl:
            process.env.HOST_URL +
            '/auth/verify/' +
            EMAIL_VERIFICATION_RESET_PASSWORD +
            '/' +
            user.id, //+
          // '/' +
          // hashedEmail,
        },
      });

      console.log(
        '[API /auth/forgot_password] Send reset password email successfully',
      );

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/forgot_password] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/forgot_password] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }

  // [POST] /reset_password
  async resetPassword(
    userId: string,
    new_password: string,
    // token: string,
    res: Response,
  ) {
    console.log('[API /auth/reset_password]');
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (user == null) {
        console.log('[API /auth/reset_password] Not found user');
        return res.status(HttpStatus.NOT_FOUND).send(HTTP_MSG_NOTFOUND);
      }

      // const idMatches = await bcrypt.compare(user.id, token);
      // if (!idMatches) {
      //   return res.status(HttpStatus.UNAUTHORIZED).send(HTTP_MSG_UNAUTHORIZED);
      // }

      const newPassword = await this.hashData(new_password);
      await this.prisma.account.update({
        where: {
          userId: user.id,
        },
        data: {
          password: newPassword,
        },
      });

      console.log('[API /auth/reset_password] Update password successfully');

      return res.status(HttpStatus.OK).send(HTTP_MSG_SUCCESS);
    } catch (error) {
      // If the error has a status property, set the corresponding HTTP status code
      if (error.status) {
        console.log(
          `[API /auth/reset_password] Unknown error: ${error.status} - ${error.message}`,
        );
        return res.status(error.status).send(error.message);
      }

      // If the error doesn't have a status property, set a generic 500 Internal Server Error status code
      console.log('[API /auth/reset_password] Internal error');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(HTTP_MSG_INTERNAL_SERVER_ERROR);
    }
  }
}
