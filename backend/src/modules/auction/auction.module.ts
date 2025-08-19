import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { PrismaService } from '@common/services/prisma.service';
import { ProductModule } from '@modules/product/product.module';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule, ProductModule],
  controllers: [AuctionController],
  providers: [AuctionService, PrismaService],
  exports: [AuctionService],
})
export class AuctionModule {}
