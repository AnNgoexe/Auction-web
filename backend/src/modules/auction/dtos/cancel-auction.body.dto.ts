import { IsNotEmpty, IsString } from 'class-validator';

export class CancelAuctionDto {
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
