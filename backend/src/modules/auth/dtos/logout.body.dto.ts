import { IsString, IsOptional } from 'class-validator';

export class LogoutBodyDto {
  @IsString()
  userId!: string;

  @IsString()
  refreshToken!: string;

  @IsOptional()
  @IsString()
  provider?: string;
}
