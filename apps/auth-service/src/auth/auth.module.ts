import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { EmailService } from '@repo/email-service';
import type { EmailConfig } from '@repo/types';
import { ConfigService } from '@repo/config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: { expiresIn: '1d' },

      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: EmailService,
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => {
        const emailConfig: EmailConfig = {
          service: configService.get<string>('EMAIL_SERVICE') || 'gmail',
          host: configService.get<string>('EMAIL_SMTP_HOST') || 'smtp.gmail.com',
          port: parseInt(configService.get<string>('EMAIL_SMTP_PORT') || '587'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_SMTP_USER') || '',
            pass: configService.get<string>('EMAIL_SMTP_PASS') || '',
          },
        };
        return new EmailService(emailConfig);
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule { }

