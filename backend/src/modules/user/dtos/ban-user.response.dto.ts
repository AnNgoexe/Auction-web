export class BanUserResponseDto {
  userId!: string;

  email!: string;

  isBanned!: boolean;

  warningCount!: number;

  bannedAt?: Date;
}
