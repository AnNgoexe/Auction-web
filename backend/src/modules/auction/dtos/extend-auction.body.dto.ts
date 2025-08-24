import { IsDateString } from 'class-validator';

export class ExtendAuctionDto {
  @IsDateString()
  newEndTime!: string;
}
