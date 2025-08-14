import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CommonModule } from '@common/common.module';
import { FollowModule } from '@modules/follow/follow.module';

@Module({
  imports: [CommonModule, FollowModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
