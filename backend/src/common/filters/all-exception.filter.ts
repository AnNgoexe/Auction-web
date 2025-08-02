import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import { Response } from 'express';
import {ERROR_INTERNAL_SERVER} from "@common/constants/error.constant";

@Catch()
export class AllExceptionFilter<T extends Error> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message || ERROR_INTERNAL_SERVER.message;

    response.status(status).json({
      ...ERROR_INTERNAL_SERVER,
      message,
    });
  }
}
