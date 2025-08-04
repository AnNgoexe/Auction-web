import { Module } from '@nestjs/common';
import { AllExceptionFilter } from '@common/filters/all-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { LoggerService } from '@common/services/logger.service';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { TokenService } from '@common/services/token.service';
import { PasswordService } from '@common/services/password.service';
import { PrismaService } from '@common/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

const service = [LoggerService, TokenService, PasswordService, PrismaService];

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [
    ...service,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
  exports: [...service],
})
export class CommonModule {}
