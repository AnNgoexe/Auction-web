import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TokenService } from '@common/services/token.service';
import { Reflector } from '@nestjs/core';
import { AuthType } from '@common/types/auth-type.enum';
import { Request } from 'express';
import {
  ERROR_MISSING_AUTH_HEADER,
  ERROR_USER_BANNED,
  ERROR_USER_UNVERIFIED,
} from '@common/constants/error.constant';
import { UserService } from '@modules/user/user.service';
import { AUTH_TYPE_KEY } from '@common/decorators/auth.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authType: AuthType =
      this.reflector.get<AuthType>(AUTH_TYPE_KEY, context.getHandler()) ??
      AuthType.NONE;

    if (authType === AuthType.NONE) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      if (authType === AuthType.OPTIONAL) return true;
      throw new UnauthorizedException(ERROR_MISSING_AUTH_HEADER);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(ERROR_MISSING_AUTH_HEADER);
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.userService.findUserById(payload.userId);
      if (!user.isVerified) {
        throw new UnauthorizedException(ERROR_USER_UNVERIFIED);
      }
      if (user.isBanned) {
        throw new ForbiddenException(ERROR_USER_BANNED);
      }

      request['user'] = payload;
      return true;
    } catch (err) {
      if (authType === AuthType.OPTIONAL) return true;
      throw err;
    }
  }
}
