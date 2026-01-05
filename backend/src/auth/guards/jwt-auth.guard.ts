// backend/src/auth/guards/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // මේකෙන් කරන්නේ Passport ලාගේ 'jwt' strategy එක පාවිච්චි කරලා 
  // එන request එකේ token එක check කරන එකයි.
}