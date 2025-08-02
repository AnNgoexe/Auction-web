import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '@common/services/logger.service';

const bootstrapLogger = new LoggerService('Bootstrap');

async function bootstrap(): Promise<{
  port: string | number;
  host: number | string;
}> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: new LoggerService('NestFactory'),
  });

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';
  await app.listen(port, host);

  return { port, host };
}

bootstrap()
  .then(({ port, host }) => {
    bootstrapLogger.log(`Application is running on http://${host}:${port}`);
  })
  .catch((error) => {
    bootstrapLogger.error('An error occurred', error);
    process.exit(1);
  });
