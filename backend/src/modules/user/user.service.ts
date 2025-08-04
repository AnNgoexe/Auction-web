import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { ERROR_USER_NOT_EXIST } from '@modules/user/user.constant';
import { UserInfoResponseDto } from '@modules/user/dtos/user-info.response.dto';
import { CreateUserResponseDto } from '@modules/user/dtos/create-user.response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string): Promise<UserInfoResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        userId: true,
        email: true,
        username: true,
        password: true,
        role: true,
        isVerified: true,
        isBanned: true,
      },
    });

    if (!user) throw new NotFoundException(ERROR_USER_NOT_EXIST);
    return user;
  }

  async createUser(
    email: string,
    username: string,
    password: string,
    isSeller: boolean,
  ): Promise<CreateUserResponseDto> {
    return this.prisma.user.create({
      data: {
        email,
        username,
        password,
        role: isSeller ? 'SELLER' : 'BIDDER',
        isVerified: false,
        isBanned: false,
      },
      select: {
        userId: true,
        email: true,
      },
    });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { userId: true },
    });
    return !!user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { userId: true },
    });
    return !!user;
  }
}
