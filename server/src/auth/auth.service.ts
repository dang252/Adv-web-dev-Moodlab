import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, role: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

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

  async register(dto: AuthDto): Promise<Tokens> {
    const newUser = await this.prisma.user.create({
      data: {
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        role: dto.role,
        refreshToken: '',
      },
    });

    const hashPassword = await this.hashData(dto.password);

    const newAccount = await this.prisma.account.create({
      data: {
        userId: newUser.id,
        username: dto.username,
        password: hashPassword,
        status: ACCOUNT_STATUS_PENDING,
      },
    });

    const tokens = await this.getTokens(newAccount.userId, newUser.role);
    await this.hashRefreshToken(newUser.id, tokens.refresh_token);

    const hashedEmail = await this.hashData(newUser.email);
    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Active your account',
      template: './activate_email',
      context: {
        verifyUrl:
          process.env.APP_URL +
          '/auth/verify/' +
          EMAIL_VERIFICATION_ACTIVATE_ACCOUNT +
          '/' +
          newUser.email +
          '/' +
          hashedEmail,
      },
    });

    return tokens;
  }

  async login(dto: AccountDto): Promise<Tokens> {
    try {
      const account = await this.prisma.account.findUnique({
        where: {
          username: dto.username,
        },
      });
      if (!account) {
        throw new HttpException("Account doesn't exist", HttpStatus.NOT_FOUND);
      }

      if (account.status != ACCOUNT_STATUS_ACTIVED) {
        throw new HttpException('Account is inactived', HttpStatus.FORBIDDEN);
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
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      }

      const tokens = await this.getTokens(account.userId, user.role);
      await this.hashRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      console.log(error);
    }
  }

  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: parseInt(userId),
          refreshToken: {
            not: '',
          },
        },
        data: {
          refreshToken: '',
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refresh(userId: string, refreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!refreshTokenMatches) {
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      }

      const tokens = await this.getTokens(user.id, user.role);
      await this.hashRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmail(type: string, email: string, token: string, res: Response) {
    console.log('[Begin] Verify Email');

    const emailMatches = await bcrypt.compare(email, token);
    if (emailMatches) {
      console.log('Email matches');
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      console.log('User found');

      switch (type) {
        case EMAIL_VERIFICATION_ACTIVATE_ACCOUNT: {
          await this.prisma.account.update({
            where: {
              userId: user.id,
            },
            data: {
              status: ACCOUNT_STATUS_ACTIVED,
            },
          });
          console.log("Updated account's status");

          res.redirect(process.env.CLIENT_HOME_PAGE);
        }
        case EMAIL_VERIFICATION_RESET_PASSWORD: {
          const hashedId = await this.hashData(user.id.toString());

          res.redirect(
            process.env.CLIENT_RESET_PASSWORD_PAGE +
              '/' +
              user.email +
              '/' +
              hashedId,
          );
        }
        default: {
          res.redirect(process.env.CLIENT_HOME_PAGE);
        }
      }
    }

    console.log('[End] Verify Email');
  }

  async forgotPassword(email: string) {
    const hashedEmail = await this.hashData(email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './reset_password',
      context: {
        verifyUrl:
          process.env.APP_URL +
          '/auth/verify/' +
          EMAIL_VERIFICATION_RESET_PASSWORD +
          '/' +
          email +
          '/' +
          hashedEmail,
      },
    });
  }

  async resetPassword(email: string, new_password: string, token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const idMatches = await bcrypt.compare(user.id, token);
    if (!idMatches) {
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }

    const newPassword = await this.hashData(new_password);
    await this.prisma.account.update({
      where: {
        userId: user.id,
      },
      data: {
        password: newPassword,
      },
    });
  }
}
