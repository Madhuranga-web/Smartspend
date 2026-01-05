// backend/src/auth/strategies/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header එකෙන් Token එක ගන්නවා
      ignoreExpiration: false,
      secretOrKey: 'MY_SECRET_KEY_123', // ඔයාගේ AuthModule එකේ තියෙන secret key එකම මෙතනටත් දෙන්න
    });
  }

  async validate(payload: any) {
    // මේ payload එකේ තමයි user ගේ ID එක සහ Email එක තියෙන්නේ
    return { userId: payload.sub, email: payload.email };
  }
}