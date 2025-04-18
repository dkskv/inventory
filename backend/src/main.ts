import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrimPipe } from './shared/resolver/trim-pipe';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../shared/env-validation';
import { isString } from 'lodash';
import { GqlExceptionFilter } from './exception-filter';
import * as compression from 'compression';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvVariables, true>);

  // не влияет на graphql
  app.setGlobalPrefix('api');

  // Включаем gzip-сжатие для всех ответов
  app.use(compression());

  const frontendUrl = configService.get('FRONTEND_ORIGIN');

  if (isString(frontendUrl)) {
    app.enableCors({ origin: frontendUrl, credentials: true });
  }

  app.useGlobalPipes(new TrimPipe());

  if (configService.get('NODE_ENV') === 'production') {
    app.useGlobalFilters(new GqlExceptionFilter());
  }

  await app.listen(configService.get('LISTEN_PORT'));

  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, async () => {
      await app.close();
      process.exit();
    }),
  );
})();
