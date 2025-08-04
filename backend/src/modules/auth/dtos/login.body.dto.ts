import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  provider?: string;
}
