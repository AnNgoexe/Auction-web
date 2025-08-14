import { Module } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { CommonModule } from '@common/common.module';
import { UserController } from '@modules/user/user.controller';

@Module({
  imports: [CommonModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
