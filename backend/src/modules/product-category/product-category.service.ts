import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { ERROR_CATEGORIES_NOT_FOUND } from '@modules/product/product.constant';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProductCategories(
    productId: string,
    categoryIds: string[],
  ): Promise<void> {
    const existingCategories = await this.prisma.category.findMany({
      where: { categoryId: { in: categoryIds } },
      select: { categoryId: true },
    });
    const existingIds = existingCategories.map((c) => c.categoryId);
    const missingIds = categoryIds.filter((id) => !existingIds.includes(id));
    if (missingIds.length)
      throw new NotFoundException(ERROR_CATEGORIES_NOT_FOUND);

    await this.prisma.productCategory.deleteMany({ where: { productId } });
    await this.prisma.productCategory.createMany({
      data: categoryIds.map((categoryId) => ({ productId, categoryId })),
    });
  }
}
