import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import type { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth')
  async getAuthHello() {
    return this.appService.getAuthHello();
  }

  @Post('auth/signin')
  async signin(@Body() userData: CreateUserDto) {
    return this.appService.createUser(userData);


  }

  @Post('auth/login')
  async login(@Body() loginData: LoginDto) {
    return this.appService.login(loginData);

  }

  @Put('auth/update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.appService.updateUser(id, updateUserDto);

  }
  @Delete('auth/delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }

  @Get('auth/verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.appService.verifyEmail(token);
  }

}