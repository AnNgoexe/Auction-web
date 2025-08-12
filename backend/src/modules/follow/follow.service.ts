import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import {
  ERROR_ALREADY_BLOCKED,
  ERROR_ALREADY_FOLLOWED,
  ERROR_CANNOT_ACCEPT_SELF,
  ERROR_CANNOT_BLOCK_SELF,
  ERROR_CANNOT_DECLINE_SELF,
  ERROR_CANNOT_FOLLOW_SELF,
  ERROR_CANNOT_UNFOLLOW_SELF,
  ERROR_FOLLOW_BLOCKED,
  ERROR_BIDDER_NOT_FOUND,
  ERROR_INVALID_RELATION_ACTION,
  ERROR_NO_FOLLOW_REQUEST,
  ERROR_NOT_FOLLOWING,
  ERROR_SELLER_NOT_FOUND,
  ERROR_UNFOLLOW_BLOCKED,
} from '@modules/follow/follow.constant';
import { FollowStatus, Role } from '@prisma/client';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(userId: string, sellerId: string): Promise<void> {
    if (userId === sellerId)
      throw new ConflictException(ERROR_CANNOT_FOLLOW_SELF);

    await this.validateBidderAndSeller(userId, sellerId);
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_sellerId: {
          followerId: userId,
          sellerId: sellerId,
        },
      },
    });

    if (existingFollow) {
      if (existingFollow.status === FollowStatus.BLOCKED)
        throw new ForbiddenException(ERROR_FOLLOW_BLOCKED);
      if (
        existingFollow.status === FollowStatus.ACTIVE ||
        existingFollow.status === FollowStatus.PENDING
      )
        throw new ConflictException(ERROR_ALREADY_FOLLOWED);
      await this.prisma.follow.update({
        where: { followId: existingFollow.followId },
        data: { status: FollowStatus.PENDING },
      });
    } else {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          sellerId: sellerId,
          status: FollowStatus.PENDING,
        },
      });
    }
  }

  async unfollow(userId: string, sellerId: string): Promise<void> {
    if (userId === sellerId)
      throw new ConflictException(ERROR_CANNOT_UNFOLLOW_SELF);

    await this.validateBidderAndSeller(userId, sellerId);
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_sellerId: {
          followerId: userId,
          sellerId: sellerId,
        },
      },
    });

    if (
      !existingFollow ||
      existingFollow.status === FollowStatus.UNFOLLOWED ||
      existingFollow.status === FollowStatus.DECLINED
    )
      throw new ConflictException(ERROR_NOT_FOLLOWING);

    if (existingFollow.status === FollowStatus.BLOCKED)
      throw new ForbiddenException(ERROR_UNFOLLOW_BLOCKED);

    await this.prisma.follow.update({
      where: { followId: existingFollow.followId },
      data: { status: FollowStatus.UNFOLLOWED },
    });
  }

  async accept(sellerId: string, userId: string): Promise<void> {
    if (sellerId === userId)
      throw new ConflictException(ERROR_CANNOT_ACCEPT_SELF);

    await this.validateBidderAndSeller(userId, sellerId);

    const existingFollowRequest = await this.prisma.follow.findUnique({
      where: {
        status: FollowStatus.PENDING,
        followerId_sellerId: {
          followerId: userId,
          sellerId: sellerId,
        },
      },
    });

    if (!existingFollowRequest)
      throw new NotFoundException(ERROR_NO_FOLLOW_REQUEST);

    await this.prisma.follow.update({
      where: { followId: existingFollowRequest.followId },
      data: { status: FollowStatus.ACTIVE },
    });
  }

  async decline(sellerId: string, userId: string): Promise<void> {
    if (sellerId === userId)
      throw new ConflictException(ERROR_CANNOT_DECLINE_SELF);

    await this.validateBidderAndSeller(userId, sellerId);

    const existingFollowRequest = await this.prisma.follow.findUnique({
      where: {
        status: FollowStatus.PENDING,
        followerId_sellerId: {
          followerId: userId,
          sellerId: sellerId,
        },
      },
    });

    if (!existingFollowRequest)
      throw new NotFoundException(ERROR_NO_FOLLOW_REQUEST);

    await this.prisma.follow.update({
      where: { followId: existingFollowRequest.followId },
      data: { status: FollowStatus.DECLINED },
    });
  }

  async block(sellerId: string, userId: string): Promise<void> {
    if (sellerId === userId)
      throw new ConflictException(ERROR_CANNOT_BLOCK_SELF);

    await this.validateBidderAndSeller(userId, sellerId);

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_sellerId: {
          followerId: userId,
          sellerId: sellerId,
        },
      },
    });

    if (!existingFollow) {
      await this.prisma.follow.create({
        data: {
          followerId: userId,
          sellerId: sellerId,
          status: FollowStatus.BLOCKED,
        },
      });
      return;
    }
    if (existingFollow.status === FollowStatus.BLOCKED)
      throw new ConflictException(ERROR_ALREADY_BLOCKED);

    await this.prisma.follow.update({
      where: { followId: existingFollow.followId },
      data: { status: FollowStatus.BLOCKED },
    });
  }

  private async validateBidderAndSeller(
    bidderId: string,
    sellerId: string,
  ): Promise<void> {
    const [bidder, seller] = await Promise.all([
      this.prisma.user.findUnique({
        where: { userId: bidderId },
        select: { userId: true, role: true },
      }),
      this.prisma.user.findUnique({
        where: { userId: sellerId, isBanned: false, isVerified: true },
        select: { userId: true, role: true },
      }),
    ]);

    if (!bidder) throw new NotFoundException(ERROR_BIDDER_NOT_FOUND);
    if (!seller) throw new NotFoundException(ERROR_SELLER_NOT_FOUND);
    if (bidder.role !== Role.BIDDER || seller.role !== Role.SELLER)
      throw new BadRequestException(ERROR_INVALID_RELATION_ACTION);
  }
}
