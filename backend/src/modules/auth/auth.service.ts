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

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
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

    const tokenId = crypto.randomUUID();
    const refreshTokenPayload: RefreshTokenPayloadInput = {
      userId,
      tokenId,
      provider,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(accessTokenPayload),
      this.tokenService.generateRefreshToken(refreshTokenPayload),
    ]);

    return { accessToken, refreshToken };
  }
}
