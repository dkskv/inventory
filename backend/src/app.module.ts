import { ApolloDriver } from '@nestjs/apollo';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './entities/catalogs/locations/location.module';
import { AssetModule } from './entities/catalogs/assets/asset.module';
import { ResponsibleModule } from './entities/catalogs/responsibles/responsible.module';
import { InventoryRecordModule } from './entities/inventory/inventory-records/inventory-record.module';
import { InventoryLogModule } from './entities/inventory/inventory-log/inventoty-log.module';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  envValidationSchema,
  type EnvVariables,
} from '../shared/env-validation';
import { StaticModule } from './serve-static/serve-static.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envValidationSchema.parse(config),
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables, true>) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService<EnvVariables, true>) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: configService.get('NODE_ENV') === 'development',
      }),
    }),
    UserModule,
    AuthModule,
    AssetModule,
    LocationModule,
    ResponsibleModule,
    InventoryRecordModule,
    InventoryLogModule,
    SeedModule,
    StaticModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly seedService: SeedService,
    private readonly configService: ConfigService<EnvVariables, true>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedService.seedAdminUser(
      this.configService.get('SEED_USER_USERNAME'),
      this.configService.get('SEED_USER_PASSWORD'),
    );
  }
}
