import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { ERROR_USER_NOT_EXIST } from '@modules/user/user.constant';
import { UserInfoResponseDto } from '@modules/user/dtos/user-info.response.dto';
import { CreateUserResponseDto } from '@modules/user/dtos/create-user.response.dto';
import { UserQueryDto } from '@modules/user/dtos/get-users.query.dto';
import { Prisma } from '@prisma/client';
import { PaginationResult } from '@common/types/pagination.interface';

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

  async findUserById(
    userId: string,
  ): Promise<Omit<UserInfoResponseDto, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        email: true,
        username: true,
        role: true,
        isVerified: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException(ERROR_USER_NOT_EXIST);
    return user;
  }

  async updatePassword(
    userId: string,
    newHashedPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true },
    });

    if (!user) {
      throw new NotFoundException(ERROR_USER_NOT_EXIST);
    }

    await this.prisma.user.update({
      where: { userId },
      data: { password: newHashedPassword },
    });
  }

  async findUsers(
    filter: UserQueryDto,
  ): Promise<PaginationResult<Omit<UserInfoResponseDto, 'password'>>> {
    const {
      email,
      username,
      role,
      isVerified,
      isBanned,
      createdAfter,
      createdBefore,
      limit = 10,
      offset = 0,
    } = filter;

    const where: Prisma.UserWhereInput = {};

    if (email) where.email = { contains: email };
    if (username) where.username = { contains: username };
    if (role) where.role = role;
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (isBanned !== undefined) where.isBanned = isBanned;
    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) where.createdAt.gte = new Date(createdAfter);
      if (createdBefore) where.createdAt.lte = new Date(createdBefore);
    }

    const [totalItems, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        select: {
          userId: true,
          email: true,
          username: true,
          role: true,
          isVerified: true,
          isBanned: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      meta: {
        totalItems,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages,
        currentPage,
      },
    };
  }
}
