import { Module } from '@nestjs/common';
import { AllExceptionFilter } from "@common/filters/all-exception.filter";
import {HttpExceptionFilter} from "@common/filters/http-exception.filter";

@Module({
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ]
})
export class CommonModule {}
