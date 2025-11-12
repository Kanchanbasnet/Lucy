import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async signin(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
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
}