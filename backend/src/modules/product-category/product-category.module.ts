import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
