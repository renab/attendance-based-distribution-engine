import { Module } from '@nestjs/common';
import { UserService } from './auth.service';
import { UserController } from './auth.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}