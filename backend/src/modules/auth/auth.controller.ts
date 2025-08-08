import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { LoginBodyDto } from '@modules/auth/dtos/login.body.dto';
import { LoginResponseDto } from '@modules/auth/dtos/login.response.dto';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { Request } from 'express';
import { RegisterBodyDto } from '@modules/auth/dtos/register.body.dto';
import { RegisterResponseDto } from '@modules/auth/dtos/register.response.dto';
import { ResponsePayload } from '@common/types/response.interface';
import { RefreshTokenBodyDto } from '@modules/auth/dtos/refresh-token.body.dto';
import { RefreshTokenResponseDto } from '@modules/auth/dtos/refresh-token.response.dto';
import { ResetPasswordDto } from '@modules/auth/dtos/reset-password.body.dto';
import { VerifyOtpDto } from '@modules/auth/dtos/verify-otp.body.dto';
import { LogoutBodyDto } from '@modules/auth/dtos/logout.body.dto';
import { CheckEmailResponseDto } from '@modules/auth/dtos/check-mail.response.dto';
import { CheckEmailBodyDto } from '@modules/auth/dtos/check-mail.body.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginBodyDto: LoginBodyDto,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const loginResponse: LoginResponseDto =
      await this.authService.login(loginBodyDto);
    await this.refreshTokenService.saveRefreshToken(
      loginResponse.user.userId,
      loginResponse.refreshToken,
      loginResponse.user.provider,
      ip,
      userAgent,
    );

    return {
      message: 'Login successfully',
      data: loginResponse,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerBodyDto: RegisterBodyDto,
  ): Promise<ResponsePayload> {
    const registerResponse: RegisterResponseDto =
      await this.authService.register(registerBodyDto);
    return {
      message: 'Register successfully',
      data: registerResponse,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenBodyDto: RefreshTokenBodyDto,
    @Req() req: Request,
  ): Promise<ResponsePayload> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    const tokens: RefreshTokenResponseDto = await this.authService.refreshToken(
      refreshTokenBodyDto.refreshToken,
      ip,
      userAgent,
    );

    return {
      message: 'Refresh token successfully',
      data: tokens,
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ResponsePayload> {
    await this.authService.resetPassword(dto);
    return {
      message: 'Password reset successfully',
      data: {},
    };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<ResponsePayload> {
    await this.authService.verifyOtp(dto);
    return {
      message: 'OTP verified successfully',
      data: {},
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutBodyDto): Promise<ResponsePayload> {
    await this.authService.logout(dto);
    return {
      message: 'Logout successfully',
      data: {},
    };
  }

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(@Body() dto: CheckEmailBodyDto): Promise<ResponsePayload> {
    const result: CheckEmailResponseDto =
      await this.authService.checkEmail(dto);
    return {
      message: 'Email exists',
      data: result,
    };
  }
}
