import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello from Gateway!';
  }

  async getAuthHello(): Promise<string> {
    // Send message to auth-service microservice
    const response = await firstValueFrom(
      this.authClient.send('get_hello', {}),
    );
    return response;
  }

  /**
   * Example: Create user securely via auth-service
   * Password will be hashed in auth-service before storage
   */
  async createUser(userData: { email: string; password: string; name?: string }) {
    const response = await firstValueFrom(
      this.authClient.send('create_user', userData),
    );
    return response;
  }
}