import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@common/common.module';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { FollowModule } from '@modules/follow/follow.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    RefreshTokenModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
