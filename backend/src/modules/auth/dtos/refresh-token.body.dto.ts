import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenBodyDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
