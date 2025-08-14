import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { GetProfileResponseDto } from '@modules/profile/dtos/get-profile.response.dto';
import { ERROR_PROFILE_NOT_FOUND } from '@modules/profile/profile.constant';
import { UpdateProfileDto } from '@modules/profile/dtos/update-profile.body.dto';
import { FileService } from '@common/services/file.service';
import { UpdateProfileResponseDto } from '@modules/profile/dtos/update-profile.response.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getUserProfile(userId: string): Promise<GetProfileResponseDto> {
    const info = await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        profile: {
          select: { fullName: true, phoneNumber: true, profileImageUrl: true },
        },
      },
    });

    if (!info) throw new NotFoundException(ERROR_PROFILE_NOT_FOUND);
    let profileImageUrl: string | undefined | null =
      info.profile?.profileImageUrl;
    if (profileImageUrl && this.fileService) {
      profileImageUrl = this.fileService.getFileUrl(profileImageUrl);
    }

    return {
      userId: info.userId,
      email: info.email,
      username: info.username,
      role: info.role,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
      fullName: info.profile?.fullName,
      profileImageUrl: profileImageUrl,
      phoneNumber: info.profile?.phoneNumber,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<UpdateProfileResponseDto> {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    let profileImageKey = dto.profileImageUrl;
    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) throw new Error('File size exceeds 5MB limit');

      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      if (!allowedMimeTypes.includes(file.mimetype))
        throw new Error(
          'Invalid file type. Only JPEG, PNG, GIF, WEBP are allowed.',
        );

      if (existingProfile?.profileImageUrl) {
        await this.fileService.deleteFile(existingProfile.profileImageUrl);
      }
      profileImageKey = await this.fileService.uploadFile('avatars', file);
    }

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: {
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        profileImageUrl: profileImageKey,
      },
      create: {
        userId,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        profileImageUrl: profileImageKey,
      },
    });

    return {
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      profileImageUrl: profile.profileImageUrl
        ? this.fileService.getFileUrl(profile.profileImageUrl)
        : null,
    };
  }
}
