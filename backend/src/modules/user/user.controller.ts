import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { ResponsePayload } from '@common/types/response.interface';
import { Auth } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UserQueryDto } from '@modules/user/dtos/get-users.query.dto';
import { Request } from 'express';
import { UpdatePasswordDto } from '@modules/user/dtos/update-password.body.dto';
import { ERROR_PASSWORD_CONFIRM_MISMATCH } from '@modules/auth/auth.constant';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(AuthType.ACCESS_TOKEN)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() filter: UserQueryDto): Promise<ResponsePayload> {
    const result = await this.userService.findUsers(filter);
    return {
      message: 'Users retrieved successfully',
      data: {
        users: result.data,
        meta: result.meta,
      },
    };
  }

  @Patch('password')
  @Auth(AuthType.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Req() req: Request,
    @Body() dto: UpdatePasswordDto,
  ): Promise<ResponsePayload> {
    const userId = req.user?.userId;
    const { newPassword, confirmNewPassword } = dto;
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(ERROR_PASSWORD_CONFIRM_MISMATCH);
    }
    await this.userService.updatePassword(userId as string, newPassword);
    return {
      message: 'Update password successfully',
      data: {},
    };
  }
}
