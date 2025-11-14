import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types';
import { UserService } from '../user/user.service';
import { EmailService } from '@repo/email-service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@repo/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) { }

  async signin(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    console.log('baseUrl:::::', baseUrl)
    const verificationUrl = `${baseUrl}/verify-email?token=${user.verificationToken}`;
    
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: 'Verify Your Email Address',
        template: 'email-verification',
        context: {
          name: user.name,
          verificationUrl,
        },
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
    
    const { verificationToken, ...userResponse } = user;
    return userResponse;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.findUserWithPasswordByEmail(loginDto.email);
      
      if (!user) {
        throw new UnauthorizedException('Invalid Credentials.');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials.');
      }

      // Check if user is verified
      if (!user.verified) {
        throw new UnauthorizedException('Please verify your email address before logging in.');
      }

      console.log('jwt_secret', process.env.JWT_SECRET);

      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      
      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Login failed');
    }
  }

  async updateUser(id: string,updateUserDto: UpdateUserDto){
    return this.userService.updateUser(id, updateUserDto);
  }

  async deleteUser(id: string){
    return this.userService.deleteUser(id);
  }

  async verifyEmail(token: string) {
    return this.userService.verifyUser(token);
  }
}