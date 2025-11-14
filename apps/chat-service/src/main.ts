import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from '@repo/config'

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const port = configService.get<number>('CHAT_SERVICE_PORT', 4002)
  
  const app = await NestFactory.create(
    AppModule
  );
  app.enableCors({
    origin: '*',
    credentials: true
  })
  await app.listen(port);
  console.log('✅ Chat-service running on port 4002');
}
bootstrap();
