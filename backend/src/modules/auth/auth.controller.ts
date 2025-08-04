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
}
