import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
