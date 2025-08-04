import { Module } from '@nestjs/common';
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
