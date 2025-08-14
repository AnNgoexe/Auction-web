import { Role } from '@prisma/client';

export class GetProfileResponseDto {
  userId!: string;

  email!: string;

  username!: string;

  role!: Role;

  createdAt!: Date;

  updatedAt!: Date;

  fullName?: string | null;

  phoneNumber?: string | null;

  profileImageUrl?: string | null;

  isFollowed?: boolean;
}
