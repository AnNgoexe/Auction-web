import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAuctionBodyDto {
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsString()
  startingPrice!: string;

  @IsString()
  minimumBidIncrement!: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateAuctionProductDto)
  products!: UpdateAuctionProductDto[];
}

export class UpdateAuctionProductDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
