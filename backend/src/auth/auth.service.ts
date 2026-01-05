import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // --- නව ගිණුමක් සෑදීම ---
  async signUp(name: string, email: string, password: string) {
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword });
    return await user.save();
  }

  // --- ලොග් වීම ---
  async login(email: string, pass: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Token එකක් සාදා එවීම
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}