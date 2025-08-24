import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService } from '@common/services/password.service';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@common/services/token.service';
import {
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_EMAIL_ALREADY_VERIFIED,
  ERROR_USER_NOT_FOUND,
  ERROR_INVALID_LOGOUT_TOKEN,
  ERROR_INVALID_PASSWORD,
  ERROR_PASSWORD_CONFIRM_MISMATCH,
  ERROR_REFRESH_TOKEN_NOT_FOUND,
  ERROR_USER_BLOCKED,
  ERROR_USERNAME_ALREADY_EXISTS,
} from '@modules/auth/auth.constant';
import {
  AccessTokenPayloadInput,
  RefreshTokenPayloadInput,
} from '@common/types/token-payload.interface';
import { LoginBodyDto } from '@modules/auth/dtos/login.body.dto';
import { LoginResponseDto } from '@modules/auth/dtos/login.response.dto';
import { RegisterBodyDto } from '@modules/auth/dtos/register.body.dto';
import { RegisterResponseDto } from '@modules/auth/dtos/register.response.dto';
import { RefreshTokenResponseDto } from '@modules/auth/dtos/refresh-token.response.dto';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { OtpService } from '@modules/otp/otp.service';
import { OtpType } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { VerifyOtpDto } from '@modules/auth/dtos/verify-otp.body.dto';
import { CheckEmailBodyDto } from '@modules/auth/dtos/check-mail.body.dto';
import { CheckEmailResponseDto } from '@modules/auth/dtos/check-mail.response.dto';
import { ResetPasswordDto } from '@modules/auth/dtos/reset-password.body.dto';
import { LogoutBodyDto } from '@modules/auth/dtos/logout.body.dto';
import { MailService } from '@common/services/mail.service';
import { MailType } from '@common/constants/mail.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly otpService: OtpService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async login(loginBodyDto: LoginBodyDto): Promise<LoginResponseDto> {
    const { email, password, provider = 'local' } = loginBodyDto;
    const user = await this.userService.findUser(email);

    if (user.isBanned) throw new ForbiddenException(ERROR_USER_BLOCKED);
    if (provider === 'local') {
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException(ERROR_INVALID_PASSWORD);
    }

    if (!user.isVerified) {
      const otpCode = await this.otpService.createOrUpdateOtp(
        user.userId,
        OtpType.VERIFY_EMAIL,
      );

      await this.mailService.sendMail(
        user.email,
        otpCode,
        MailType.VERIFY_EMAIL,
      );
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.userId,
      user.email,
      user.role,
      user.username,
      provider,
      user.isVerified,
      user.isBanned,
    );

    return {
      user: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
        provider,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(
    registerBodyDto: RegisterBodyDto,
  ): Promise<RegisterResponseDto> {
    const { email, username, password, isSeller } = registerBodyDto;

    const emailExists = await this.userService.checkEmailExists(email);
    if (emailExists) throw new ConflictException(ERROR_EMAIL_ALREADY_EXISTS);

    const usernameExists = await this.userService.checkUsernameExists(username);
    if (usernameExists)
      throw new ConflictException(ERROR_USERNAME_ALREADY_EXISTS);

    const hashedPassword = await this.passwordService.hashPassword(password);
    const newUser = await this.userService.createUser(
      email,
      username,
      hashedPassword,
      isSeller,
    );
    const otpCode = await this.otpService.createOrUpdateOtp(
      newUser.userId,
      OtpType.VERIFY_EMAIL,
    );

    await this.mailService.sendMail(
      newUser.email,
      otpCode,
      MailType.VERIFY_EMAIL,
    );

    return { userId: newUser.userId, email: newUser.email };
  }

  async refreshToken(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ): Promise<RefreshTokenResponseDto> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const { userId, provider } = payload;
    const tokenExists = await this.refreshTokenService.findRefreshToken(
      userId,
      refreshToken,
      provider,
    );

    if (!tokenExists)
      throw new UnauthorizedException(ERROR_REFRESH_TOKEN_NOT_FOUND);

    const user = await this.userService.findUserById(payload.userId);
    if (!user || user.isBanned) {
      throw new ForbiddenException(ERROR_USER_BLOCKED);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(
        user.userId,
        user.email,
        user.role,
        user.username,
        provider,
        user.isVerified,
        user.isBanned,
      );

    await this.refreshTokenService.saveRefreshToken(
      userId,
      newRefreshToken,
      provider,
      ip,
      userAgent,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<void> {
    const { userId, type, code } = dto;
    await this.otpService.checkOtp(userId, type, code);

    if (type === OtpType.VERIFY_EMAIL) {
      await this.prisma.user.update({
        where: { userId },
        data: { isVerified: true },
      });
    }

    await this.otpService.invalidateOtp(userId, type);
  }

  async checkEmail(dto: CheckEmailBodyDto): Promise<CheckEmailResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException(ERROR_USER_NOT_FOUND);
    }

    const otpCode = await this.otpService.createOrUpdateOtp(
      user.userId,
      OtpType.RESET_PASSWORD,
    );

    await this.mailService.sendMail(
      user.email,
      otpCode,
      MailType.RESET_PASSWORD,
    );

    return { userId: user.userId, email: user.email };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { userId, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(ERROR_PASSWORD_CONFIRM_MISMATCH);
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.userService.updatePassword(userId, hashedPassword);
  }

  async logout(dto: LogoutBodyDto): Promise<void> {
    const { userId, refreshToken, provider = 'local' } = dto;
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    if (payload.userId !== userId || payload.provider !== provider) {
      throw new UnauthorizedException(ERROR_INVALID_LOGOUT_TOKEN);
    }

    await this.refreshTokenService.revokeRefreshToken(
      userId,
      refreshToken,
      provider,
    );
  }

  async sendOtpEmail(email: string, type: OtpType): Promise<void> {
    const user = await this.userService.findUser(email);

    if (type === OtpType.VERIFY_EMAIL && user.isVerified) {
      throw new BadRequestException(ERROR_EMAIL_ALREADY_VERIFIED);
    }

    const otpCode = await this.otpService.createOrUpdateOtp(user.userId, type);
    const mailType =
      type === OtpType.VERIFY_EMAIL
        ? MailType.VERIFY_EMAIL
        : MailType.RESET_PASSWORD;

    await this.mailService.sendMail(user.email, otpCode, mailType);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    username: string,
    provider = 'local',
    isVerified: boolean,
    isBanned: boolean,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload: AccessTokenPayloadInput = {
      userId,
      email,
      role,
      username,
      provider,
      isVerified,
      isBanned,
    };

    const refreshTokenPayload: RefreshTokenPayloadInput = {
      userId,
      provider,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(accessTokenPayload),
      this.tokenService.generateRefreshToken(refreshTokenPayload),
    ]);

    return { accessToken, refreshToken };
  }
}
