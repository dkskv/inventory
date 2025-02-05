import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/locales',
      rootPath: join(__dirname, '..', 'public', 'locales'),
      serveStaticOptions: { index: false, fallthrough: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/graphql'],
    }),
  ],
})
export class StaticModule {}
