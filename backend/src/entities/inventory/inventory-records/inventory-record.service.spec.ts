import { Filtration, InventoryRecordService } from './inventory-record.service';
import { InventoryRecord } from './inventory-record.entity';
import { DataSource } from 'typeorm';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { Status } from 'src/entities/catalogs/statuses/status.entity';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { AssetService } from 'src/entities/catalogs/assets/asset.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';
import { CatalogEntityService } from 'src/entities/catalogs/shared/service/catalog-entity.service';
import { DeepPartial } from 'typeorm';
import { StatusService } from 'src/entities/catalogs/statuses/status.service';
import { expectPartialMatch } from 'src/shared/testing-utils/expect-partial-match';
import { createTestingDataSource } from 'src/shared/testing-utils/create-testing-data-source';

describe('InventoryRecordService', () => {
  let service: InventoryRecordService;
  let dataSource: DataSource;

  // Test entities
  let assets: Map<string, Asset>;
  let locations: Map<string, Location>;
  let responsibles: Map<string, Responsible>;
  let statuses: Map<string, Status>;

  // Test data setup helpers
  const createCatalogEntities = async <T extends { id: number; name: string }>(
    service: CatalogEntityService<T>,
    count: number,
    defaultValue: DeepPartial<T> = {} as DeepPartial<T>,
  ): Promise<Map<string, T>> => {
    for (let i = 0; i < count; i++) {
      await service.create({ ...defaultValue, name: String(i) });
    }
    const { items } = await service.findPagedItems({ offset: 0, limit: count });
    return new Map(items.map((item) => [item.name, item]));
  };

  const createInventoryRecord = (entity: DeepPartial<InventoryRecord>) => {
    return service.create(0, entity);
  };

  const updateInventoryRecord = (
    filtration: Filtration,
    diff: DeepPartial<InventoryRecord>,
  ) => {
    return service.updateByFiltration(0, filtration, diff);
  };

  const createInventoryRecordByNames = (
    assetName: string,
    locationName: string,
    responsibleName: string,
  ) => {
    return createInventoryRecord({
      asset: assets.get(assetName),
      location: locations.get(locationName),
      responsible: responsibles.get(responsibleName),
    });
  };

  const setupTestRecords = async () => {
    // Group 1: 3 records
    await createInventoryRecordByNames('0', '0', '0');
    await createInventoryRecordByNames('0', '0', '0');
    await createInventoryRecordByNames('0', '0', '0');

    // 1 record
    await createInventoryRecordByNames('1', '1', '2');

    // 1 record
    await createInventoryRecordByNames('1', '1', '3');

    // Group 2: 2 records
    await createInventoryRecordByNames('1', '0', '0');
    await createInventoryRecordByNames('1', '0', '0');

    // Group 3: 3 records
    await createInventoryRecordByNames('1', '0', '1');
    await createInventoryRecordByNames('1', '0', '1');
    await createInventoryRecordByNames('1', '0', '1');

    // Group 4: 2 records
    await createInventoryRecordByNames('1', '1', '1');
    await createInventoryRecordByNames('1', '1', '1');
  };

  beforeAll(async () => {
    dataSource = await createTestingDataSource([
      InventoryRecord,
      Asset,
      Location,
      Responsible,
      Status,
    ]);

    [assets, locations, responsibles, statuses] = await Promise.all([
      createCatalogEntities(
        new AssetService(dataSource.getRepository(Asset)),
        4,
      ),
      createCatalogEntities(
        new LocationService(dataSource.getRepository(Location)),
        4,
      ),
      createCatalogEntities(
        new ResponsibleService(dataSource.getRepository(Responsible)),
        4,
      ),
      createCatalogEntities(
        new StatusService(dataSource.getRepository(Status)),
        4,
        { color: '#000000' },
      ),
    ]);

    service = new InventoryRecordService(
      dataSource,
      dataSource.getRepository(InventoryRecord),
    );
  });

  afterEach(async () => {
    await dataSource.getRepository(InventoryRecord).delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Grouping functionality', () => {
    beforeEach(setupTestRecords);

    it('should correctly group records without affecting by updates', async () => {
      // These updates shouldn't affect grouping
      await updateInventoryRecord(
        {
          assetIds: [assets.get('0')!.id],
          locationIds: [locations.get('0')!.id],
          responsibleIds: [responsibles.get('0')!.id],
        },
        { serialNumber: 'test', description: 'test' },
      );

      await updateInventoryRecord(
        {
          assetIds: [assets.get('1')!.id],
          locationIds: [locations.get('1')!.id],
          responsibleIds: [responsibles.get('3')!.id],
        },
        { serialNumber: 'test', description: 'test' },
      );

      const { items } = await service.findAllItemsOrGroups({
        limit: 100,
        offset: 0,
      });

      expectPartialMatch(
        [
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '1' },
            count: 2,
          },
          {
            asset: { name: '1' },
            location: { name: '0' },
            responsible: { name: '1' },
            count: 3,
          },
          {
            asset: { name: '1' },
            location: { name: '0' },
            responsible: { name: '0' },
            count: 2,
          },
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '3' },
            serialNumber: 'test',
            description: 'test',
          },
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '2' },
          },
          {
            asset: { name: '0' },
            location: { name: '0' },
            responsible: { name: '0' },
            count: 3,
            serialNumber: undefined,
            description: undefined,
          },
        ],
        items,
      );
    });

    it('should support pagination', async () => {
      const firstPage = await service.findAllItemsOrGroups({
        limit: 1,
        offset: 4,
      });
      expectPartialMatch(
        [
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '2' },
          },
        ],
        firstPage.items,
      );

      const secondPage = await service.findAllItemsOrGroups({
        limit: 2,
        offset: 2,
      });
      expectPartialMatch(
        [
          {
            asset: { name: '1' },
            location: { name: '0' },
            responsible: { name: '0' },
            count: 2,
          },
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '3' },
          },
        ],
        secondPage.items,
      );
    });
  });

  describe('Drill-down functionality', () => {
    beforeEach(setupTestRecords);

    it('should return all records when drilling into a group', async () => {
      const { items } = await service.findAll(
        { limit: 100, offset: 0 },
        {
          assetIds: [assets.get('1')!.id],
          locationIds: [locations.get('0')!.id],
          responsibleIds: [responsibles.get('1')!.id],
        },
      );

      expectPartialMatch(
        Array.from({ length: 3 }, () => ({
          asset: { name: '1' },
          location: { name: '0' },
          responsible: { name: '1' },
        })),
        items,
      );
    });
  });

  describe('Status management', () => {
    it('statuses are added when creating a record', async () => {
      const entity: DeepPartial<InventoryRecord> = {
        asset: assets.get('0'),
        location: locations.get('0'),
        responsible: responsibles.get('0'),
        statuses: [statuses.get('0')!, statuses.get('1')!],
      };

      await createInventoryRecord(entity);
      const { items } = await service.findAll({ limit: 1, offset: 0 });

      expectPartialMatch([entity], items);
    });

    it('status clearing works', async () => {
      const entity: DeepPartial<InventoryRecord> = {
        asset: assets.get('0'),
        location: locations.get('0'),
        responsible: responsibles.get('0'),
        statuses: [statuses.get('0')!, statuses.get('1')!],
      };

      await createInventoryRecord(entity);
      await updateInventoryRecord(
        {
          assetIds: [assets.get('0')!.id],
          locationIds: [locations.get('0')!.id],
          responsibleIds: [responsibles.get('0')!.id],
        },
        { statuses: [] },
      );

      const { items } = await service.findAll({ limit: 1, offset: 0 });

      expectPartialMatch([{ ...entity, statuses: [] }], items);
    });

    it('should correctly update and display statuses', async () => {
      await setupTestRecords();

      // Update statuses for different groups
      await updateInventoryRecord(
        {
          assetIds: [assets.get('1')!.id],
          locationIds: [locations.get('1')!.id],
          responsibleIds: [responsibles.get('3')!.id],
        },
        { statuses: [statuses.get('0')!, statuses.get('3')!] },
      );

      await updateInventoryRecord(
        {
          assetIds: [assets.get('1')!.id],
          locationIds: [locations.get('1')!.id],
          responsibleIds: [responsibles.get('2')!.id],
        },
        { statuses: [statuses.get('1')!] },
      );

      await updateInventoryRecord(
        {
          assetIds: [assets.get('0')!.id],
          locationIds: [locations.get('0')!.id],
          responsibleIds: [responsibles.get('0')!.id],
        },
        { statuses: [statuses.get('0')!, statuses.get('2')!] },
      );

      // Check grouped view
      const groupedView = await service.findAllItemsOrGroups({
        limit: 3,
        offset: 3,
      });
      expectPartialMatch(
        [
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '3' },
            statuses: [statuses.get('0')!, statuses.get('3')!],
          },
          {
            asset: { name: '1' },
            location: { name: '1' },
            responsible: { name: '2' },
            statuses: [statuses.get('1')!],
          },
          {
            asset: { name: '0' },
            location: { name: '0' },
            responsible: { name: '0' },
            statuses: undefined,
          },
        ],
        groupedView.items,
      );

      // Check detailed view
      const detailedView = await service.findAll(
        { limit: 100, offset: 0 },
        {
          assetIds: [assets.get('0')!.id],
          locationIds: [locations.get('0')!.id],
          responsibleIds: [responsibles.get('0')!.id],
        },
      );
      expectPartialMatch(
        Array.from({ length: 3 }, () => ({
          asset: { name: '0' },
          location: { name: '0' },
          responsible: { name: '0' },
          statuses: [statuses.get('0')!, statuses.get('2')!],
        })),
        detailedView.items,
      );
    });
  });
});
