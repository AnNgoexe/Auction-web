import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '@modules/profile/profile.service';
import { Auth } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { Request } from 'express';
import { GetProfileResponseDto } from '@modules/profile/dtos/get-profile.response.dto';
import { UpdateProfileDto } from '@modules/profile/dtos/update-profile.body.dto';
import { ResponsePayload } from '@common/types/response.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  @Auth(AuthType.OPTIONAL)
  @HttpCode(HttpStatus.OK)
  async getUserProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() request: Request,
  ): Promise<ResponsePayload> {
    const currentUserId = request.user?.userId;
    const profile: GetProfileResponseDto =
      await this.profileService.getUserProfile(userId, currentUserId);
    return {
      message: 'Get profile successfully',
      data: profile,
    };
  }

  @Put()
  @Auth(AuthType.ACCESS_TOKEN)
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResponsePayload> {
    const userId = req.user?.userId as string;
    const updatedProfile = await this.profileService.updateProfile(
      userId,
      updateProfileDto,
      file,
    );
    return {
      message: 'Profile updated successfully',
      data: updatedProfile,
    };
  }
}
