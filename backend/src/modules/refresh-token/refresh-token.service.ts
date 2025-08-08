import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { ERROR_REFRESH_TOKEN_NOT_FOUND_OR_REVOKED } from '@modules/refresh-token/refresh-token.constant';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(
    userId: string,
    token: string,
    provider = 'local',
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.refreshToken.upsert({
      where: { userId_provider: { userId, provider } },
      update: {
        token,
        ip,
        userAgent,
        isRevoked: false,
        lastUsedAt: new Date(),
      },
      create: { token, userId, provider, ip, userAgent },
    });
  }

  async findRefreshToken(
    userId: string,
    token: string,
    provider = 'local',
  ): Promise<boolean> {
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        userId: userId,
        token: token,
        provider: provider,
        isRevoked: false,
      },
    });
    return !!tokenRecord;
  }

  async revokeRefreshToken(
    userId: string,
    token: string,
    provider = 'local',
  ): Promise<void> {
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        token,
        provider,
        isRevoked: false,
      },
    });

    if (!tokenRecord) {
      throw new NotFoundException(ERROR_REFRESH_TOKEN_NOT_FOUND_OR_REVOKED);
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        isRevoked: true,
        lastUsedAt: new Date(),
      },
    });
  }
}
