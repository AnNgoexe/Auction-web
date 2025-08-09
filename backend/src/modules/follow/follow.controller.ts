import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { Roles } from '@common/decorators/roles.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ResponsePayload } from '@common/types/response.interface';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow/:sellerId')
  @Roles(Role.BIDDER)
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async follow(
    @Req() req: Request,
    @Param('sellerId') sellerId: string,
  ): Promise<ResponsePayload> {
    const userId = req.user?.userId;
    await this.followService.follow(userId as string, sellerId);
    return {
      message: 'Follow request sent successfully',
      data: {},
    };
  }

  @Delete('unfollow/:sellerId')
  @Roles(Role.BIDDER)
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async unfollow(
    @Req() req: Request,
    @Param('sellerId') sellerId: string,
  ): Promise<ResponsePayload> {
    const userId = req.user?.userId;
    await this.followService.unfollow(userId as string, sellerId);
    return {
      message: 'Unfollow successful',
      data: {},
    };
  }

  @Patch('accept/:userId')
  @Roles(Role.SELLER)
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async accept(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<ResponsePayload> {
    const sellerId = req.user?.userId;
    await this.followService.accept(sellerId as string, userId);

    return {
      message: 'Follow request accepted successfully',
      data: {},
    };
  }

  @Patch('decline/:userId')
  @Roles(Role.SELLER)
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async decline(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<ResponsePayload> {
    const sellerId = req.user?.userId;
    await this.followService.decline(sellerId as string, userId);
    return {
      message: 'Decline successful',
      data: {},
    };
  }

  @Patch('block/:userId')
  @Roles(Role.SELLER)
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async block(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<ResponsePayload> {
    const sellerId = req.user?.userId;
    await this.followService.block(sellerId as string, userId);
    return {
      message: 'Block successful',
      data: {},
    };
  }
}
