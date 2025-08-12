import { Module } from '@nestjs/common';
import { FollowController } from '@modules/follow/follow.controller';
import { FollowService } from '@modules/follow/follow.service';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
