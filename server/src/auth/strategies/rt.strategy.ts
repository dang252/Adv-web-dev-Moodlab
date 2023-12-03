import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwtPayload.type';
import { JwtRtPayload } from '../types/jwtRtPayload.type';

@Injectable()
export class RtStrategy extends PassportStrategy(
  Strategy,
  process.env.JWT_REFRESH_TOKEN,
) {
  jwtService: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
