import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';

export async function createTestingDataSource(entities: any[]) {
  const pgContainer = await new PostgreSqlContainer().start();

  const dataSource = new DataSource({
    type: 'postgres',
    host: pgContainer.getHost(),
    port: pgContainer.getPort(),
    database: pgContainer.getDatabase(),
    username: pgContainer.getUsername(),
    password: pgContainer.getPassword(),
    entities,
    synchronize: true,
    // logging: true,
  });

  return dataSource.initialize();
}
