import { IsEmail } from 'class-validator';

export class CheckEmailBodyDto {
  @IsEmail()
  email!: string;
}
