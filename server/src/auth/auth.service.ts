import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AccountDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { ACCOUNT_STATUS_ACTIVED, ACCOUNT_STATUS_PENDING } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
}
