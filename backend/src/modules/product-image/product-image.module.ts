import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
