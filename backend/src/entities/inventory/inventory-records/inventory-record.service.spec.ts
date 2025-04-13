import { InventoryRecordService } from './inventory-record.service';
import { DataType, newDb } from 'pg-mem';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { InventoryRecord } from './inventory-record.entity';
import { DataSource } from 'typeorm';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { Status } from 'src/entities/catalogs/statuses/status.entity';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { AssetService } from 'src/entities/catalogs/assets/asset.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';

async function createTestingDataSource(entities: EntityClassOrSchema[]) {
  const db = newDb();

  db.public.interceptQueries((queryText) => {
    if (/SET LOCAL/.test(queryText)) {
      return [];
    }
  });

  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'mock',
  });

  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => 'mock',
  });

  const dataSource: DataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
    synchronize: true,
  });

  return await dataSource.initialize();
}

describe('InventoryRecordService', () => {
  let assetService: AssetService;
  let locationService: LocationService;
  let responsibleService: ResponsibleService;
  let inventoryRecordService: InventoryRecordService;

  beforeAll(async () => {
    const dataSource = await createTestingDataSource([
      InventoryRecord,
      Asset,
      Location,
      Responsible,
      Status,
    ]);

    assetService = new AssetService(dataSource.getRepository(Asset));
    locationService = new LocationService(dataSource.getRepository(Location));
    responsibleService = new ResponsibleService(
      dataSource.getRepository(Responsible),
    );
    inventoryRecordService = new InventoryRecordService(
      dataSource,
      dataSource.getRepository(InventoryRecord),
    );
  });

  it('Тестовый тест', async () => {
    await assetService.create({ name: 'test' });
    await locationService.create({ name: 'test' });
    await responsibleService.create({ name: 'test' });

    await inventoryRecordService.create(
      1,
      // todo: подумать, откуда получать id
      inventoryRecordService.prepareBaseEntity({
        assetId: 1,
        locationId: 1,
        responsibleId: 1,
      }),
    );

    const { totalCount } = await inventoryRecordService.findAll({
      limit: 100,
      offset: 0,
    });

    expect(totalCount).toEqual(1);
  });
});
