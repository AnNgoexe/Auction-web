import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';

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
}
