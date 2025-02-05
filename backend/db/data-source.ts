import { DataSource } from 'typeorm';
import { envValidationSchema } from '../shared/env-validation';

const env = envValidationSchema.parse(process.env);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  /** Путь до сущностей для автоматической генерации миграций */
  entities: ['src/**/*.entity.ts'],
  /** Путь до миграций при запуске */
  migrations: ['db/migrations/*.ts'],
  synchronize: false,
} as const);
