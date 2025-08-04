import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterBodyDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsBoolean()
  @IsNotEmpty()
  isSeller!: boolean;
}
