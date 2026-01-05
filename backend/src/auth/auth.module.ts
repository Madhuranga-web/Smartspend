import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy'; // මම කලින් දුන්න JwtStrategy එක import කරන්න
import { PassportModule } from '@nestjs/passport'; // Passport module එකත් ඕනේ

@Module({
  imports: [
    // Passport එක JWT එක්ක වැඩ කරන්න අවශ්‍ය නිසා මේක එකතු කරන්න
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Database එකේ User Schema එක පාවිච්චි කරන්න අවසර දීම
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    
    // JWT Token එක හදන්න අවශ්‍ය settings
    JwtModule.register({
      global: true,
      secret: 'MY_SECRET_KEY_123', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  controllers: [AuthController],
  //Providers ඇතුළට අනිවාර්යයෙන්ම JwtStrategy එක දාන්න ඕනේ
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService, PassportModule],
})
export class AuthModule {}