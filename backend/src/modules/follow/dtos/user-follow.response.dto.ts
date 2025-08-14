import { Role } from '@prisma/client';

export class FollowUserDto {
  userId!: string;
  username!: string;
  role!: Role;
  profileImageUrl?: string | null;
}
