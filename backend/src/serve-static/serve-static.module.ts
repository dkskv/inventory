import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Отдельный route на locales, чтобы не возвращало index.html на неизвестные языки
    ServeStaticModule.forRoot({
      serveRoot: '/locales',
      rootPath: join(__dirname, '..', 'public', 'locales'),
      serveStaticOptions: { index: false, fallthrough: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/graphql', '/api'],
    }),
  ],
})
export class StaticModule {}
