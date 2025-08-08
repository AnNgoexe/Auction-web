import { Module } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { OtpService } from './otp.service';
import {CommonModule} from "@common/common.module";

@Module({
  imports: [CommonModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
