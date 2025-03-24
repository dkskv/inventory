import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, IsNull, Repository } from 'typeorm';
import { InventoryLog } from './inventory-log.entity';
import insertTriggerSql from './sql/insertTrigger.sql';
import updateTriggerSql from './sql/updateTrigger.sql';
import dropTriggersSql from './sql/dropTriggers.sql';
import { Paging } from 'src/shared/service/paging';
import { isNil, isNumber, omit } from 'lodash';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';
import { withPaging } from 'src/shared/service/with-paging';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';

export interface Filtration {
  timestamp?: Date | null;
  authorId?: number;
  action?: string | null;
  attribute?: string | null;
  prevValue?: string | null;
  nextValue?: string | null;
  inventoryRecordIds?: number[];
  assetId?: number;
}

@Injectable()
export class InventoryLogService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryLog)
    private readonly repository: Repository<InventoryLog>,
    private readonly locationsService: LocationService,
    private readonly responsibleService: ResponsibleService,
  ) {}

  private async createTrigger() {
    await this.dataSource.query(
      [insertTriggerSql, updateTriggerSql].join('\n'),
    );
    console.log('Triggers created successfully');
  }

  private async deleteTrigger() {
    await this.dataSource.query(dropTriggersSql);
    console.log('Triggers deleted successfully');
  }

  async onApplicationBootstrap() {
    await this.createTrigger();
  }

  async onApplicationShutdown() {
    await this.deleteTrigger();
  }

  private prepareFiltration(filtration: Filtration) {
    const result: FindOptionsWhere<InventoryLog> = {};

    if (!isNil(filtration.timestamp)) {
      result.timestamp = filtration.timestamp;
    }

    if (!isNil(filtration.action)) {
      result.action = filtration.action;
    }

    if (filtration.authorId !== undefined) {
      result.author =
        filtration.authorId === null ? IsNull() : { id: filtration.authorId };
    }

    if (filtration.attribute !== undefined) {
      result.attribute =
        filtration.attribute === null ? IsNull() : filtration.attribute;
    }

    if (filtration.prevValue !== undefined) {
      result.prevValue =
        filtration.prevValue === null ? IsNull() : filtration.prevValue;
    }

    if (filtration.nextValue !== undefined) {
      result.nextValue =
        filtration.nextValue === null ? IsNull() : filtration.nextValue;
    }

    if (filtration.inventoryRecordIds !== undefined) {
      result.inventoryRecord = { id: In(filtration.inventoryRecordIds) };
    }

    if (filtration.assetId !== undefined) {
      result.inventoryRecord = { asset: { id: filtration.assetId } };
    }

    return result;
  }

  async findAll(paging: Paging, filtration?: Filtration) {
    const [items, totalCount] = await this.repository.findAndCount({
      take: paging.limit,
      skip: paging.offset,
      where: filtration && this.prepareFiltration(filtration),
      order: { id: 'DESC' },
    });

    const { locations: usedLocations, responsibles: usedResponsibles } =
      await this.findUsedEntities(items);

    return { items, totalCount, usedLocations, usedResponsibles };
  }

  async findAllItemsOrGroups(paging: Paging, filtration?: Filtration) {
    const builder = this.dataSource.createQueryBuilder(InventoryLog, 'row');

    builder
      .leftJoin('row.inventoryRecord', 'inventoryRecord')
      .leftJoin('inventoryRecord.asset', 'asset')
      .leftJoin('row.author', 'author');

    builder.addGroupBy('row.prevValue');
    builder.addGroupBy('row.nextValue');
    builder.addGroupBy('author.id');
    builder.addGroupBy('asset.id');

    const restGroupingAttrs = ['timestamp', 'action', 'attribute'];
    restGroupingAttrs.forEach((attr) => builder.addGroupBy(attr));

    builder.select([
      'COUNT(*)::integer as count',
      'MIN(row.id) as id',
      'MIN(inventoryRecord.id) as "inventoryRecordId"',
      'ARRAY_AGG(inventoryRecord.serialNumber) ' +
        'FILTER (WHERE inventoryRecord.serialNumber IS NOT NULL) as "serialNumbers"',
      'TO_JSONB(asset) as asset',
      'TO_JSONB(author) as author',
      'row."prevValue"::text as "prevValue"',
      'row."nextValue"::text as "nextValue"',
      ...restGroupingAttrs.map((attr) => `row."${attr}" as "${attr}"`),
    ]);

    if (filtration) {
      builder.where(this.prepareFiltration(filtration));
    }

    builder.orderBy({ id: 'DESC' });

    const { items: rawItems, totalCount } = await withPaging(builder, paging);

    type RawItem = Omit<InventoryLog, 'inventoryRecord'> & {
      asset: Asset;
      count: number;
      inventoryRecordId: number;
      serialNumbers: string[];
    };

    const items = (rawItems as RawItem[]).map((item) =>
      item.count > 1
        ? omit(item, ['id', 'inventoryRecordId'])
        : omit(item, ['count']),
    );

    const { locations: usedLocations, responsibles: usedResponsibles } =
      await this.findUsedEntities(items);

    return { items, totalCount, usedLocations, usedResponsibles };
  }

  /** Получить сущности для атрибутов prevValue и nextValue лога */
  private async findUsedEntities(
    logs: Pick<
      InventoryLog,
      'action' | 'attribute' | 'prevValue' | 'nextValue'
    >[],
  ) {
    const locationsIds = new Set<number>();
    const responsiblesIds = new Set<number>();

    logs.forEach((log) => {
      if (log.action === 'CREATE') {
        if (log.nextValue === null) {
          return;
        }

        const { locationId, responsibleId } = JSON.parse(log.nextValue);

        locationsIds.add(locationId);
        responsiblesIds.add(responsibleId);

        return;
      }

      const addTo = (collection: Set<number>) => {
        [log.prevValue, log.nextValue].forEach((value) => {
          if (value === null) {
            return;
          }

          const id = JSON.parse(value);

          if (!isNumber(id)) {
            throw new Error('incorrect value type');
          }

          collection.add(id);
        });
      };

      switch (log.attribute) {
        case 'locationId':
          addTo(locationsIds);
          return;
        case 'responsibleId':
          addTo(responsiblesIds);
          return;
      }
    });

    const [locations, responsibles] = await Promise.all([
      this.locationsService.findByIds([...locationsIds]),
      this.responsibleService.findByIds([...responsiblesIds]),
    ]);

    return { locations, responsibles } as const;
  }
}
