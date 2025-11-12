import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) { }

  getHello(): string {
    return 'Hello from Gateway!';
  }

  async getAuthHello(): Promise<string> {
    const response = await firstValueFrom(
      this.authClient.send('get_hello', {}),
    );
    return response;
  }


  async createUser(userData: CreateUserDto) {
    const response = await firstValueFrom(
      this.authClient.send('signin', userData),
    );
    return response;
  }

  async login(loginData: LoginDto) {
    const response = await firstValueFrom(
      this.authClient.send('login', loginData)
    );
    return response;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto){
    const response = await firstValueFrom(
      this.authClient.send('update_user', {id, updateUserDto})
    )
    return response;
  }

  async deleteUser(id: string){
    const response = await firstValueFrom(
      this.authClient.send('delete_user', id)
    )
    return response;
  }
}