import { OtpType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  userId!: string;

  @IsEnum(OtpType)
  type!: OtpType;

  @IsString()
  code!: string;
}
