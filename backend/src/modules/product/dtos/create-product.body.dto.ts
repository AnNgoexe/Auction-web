import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stockQuantity!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? (value as string[]) : [value as string];
  })
  categoryIds!: string[];
}
