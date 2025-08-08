import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;

  @IsString()
  @MinLength(6)
  confirmNewPassword!: string;
}
