import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PasswordService } from '@common/services/password.service';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@common/services/token.service';
import {
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_INVALID_PASSWORD,
  ERROR_REFRESH_TOKEN_NOT_FOUND,
  ERROR_USER_IS_BANNED,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(loginBodyDto: LoginBodyDto): Promise<LoginResponseDto> {
    const { email, password, provider = 'local' } = loginBodyDto;
    const user = await this.userService.findUser(email);

    if (user.isBanned) throw new ForbiddenException(ERROR_USER_IS_BANNED);
    if (provider === 'local') {
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException(ERROR_INVALID_PASSWORD);
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

    return {
      userId: newUser.userId,
      email: newUser.email,
    };
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
      throw new ForbiddenException(ERROR_USER_IS_BANNED);
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

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
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
