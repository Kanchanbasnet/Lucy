import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @MessagePattern('get_hello')
  sayHello() {
    return 'Hello from auth-service 👋';
  }
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
