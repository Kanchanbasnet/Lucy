import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '@repo/db';


@Module({
  providers: [ UserService],
  exports: [UserService],
  imports: [PrismaModule]
})
export class UserModule {}
