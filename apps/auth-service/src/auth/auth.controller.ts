import { Injectable } from '@nestjs/common';
import type { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signin')
  async signin(@Payload() createUserDto: CreateUserDto) {
    return this.authService.signin(createUserDto);
  }

  @MessagePattern('login')
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('update_user')
  async updateUser(@Payload() data: { id: string; updateUserDto: UpdateUserDto }) {
    return this.authService.updateUser(data.id, data.updateUserDto);
  }

  @MessagePattern('delete_user')
  async deleteUser(@Payload() id: string) {
    return this.authService.deleteUser(id);
  }
}

