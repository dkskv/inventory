import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  OrderByCondition,
  Repository,
} from 'typeorm';
import { InventoryLog } from './inventory-log.entity';
import createTriggerInsertSql from './sql/create-trigger-insert.sql';
import createTriggerUpdateSql from './sql/create-trigger-update.sql';
import createTriggerInsertStatusSql from './sql/create-trigger-insert-status.sql';
import createTriggerDeleteStatusSql from './sql/create-trigger-delete-status.sql';
import dropAllTriggersSql from './sql/drop-all-triggers.sql';
import { Paging } from 'src/shared/service/paging';
import { isNil, isNumber, omit } from 'lodash';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';
import { withPaging } from 'src/shared/service/with-paging';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { StatusService } from 'src/entities/catalogs/statuses/status.service';

export interface Filtration {
  timestamp?: Date | null;
  authorId?: number;
  action?: string | null;
  attribute?: string | null;
  prevValue?: string | null;
  nextValue?: string | null;
  inventoryRecordIds?: number[];
  assetId?: number;
  ids?: number[];
}

@Injectable()
export class InventoryLogService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryLog)
    private readonly repository: Repository<InventoryLog>,
    private readonly locationsService: LocationService,
    private readonly responsibleService: ResponsibleService,
    private readonly statusService: StatusService,
  ) {}

  async createTriggers() {
    await this.dataSource.query(
      [
        createTriggerInsertSql,
        createTriggerUpdateSql,
        createTriggerInsertStatusSql,
        createTriggerDeleteStatusSql,
      ].join('\n'),
    );
    console.log('Triggers on `InventoryRecord` created successfully');
  }

  async dropTriggers() {
    await this.dataSource.query(dropAllTriggersSql);
    console.log('Triggers on `InventoryRecord` deleted successfully');
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

    if (filtration.ids !== undefined) {
      result.id = In(filtration.ids);
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

    const usedEntities = await this.findUsedEntities(items);

    return { items, totalCount, usedEntities };
  }

  async findAllItemsOrGroups(
    paging: Paging,
    filtration?: Filtration,
    order: FindOptionsOrder<InventoryLog> = { id: 'DESC' },
  ) {
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
      'COALESCE(ARRAY_AGG(inventoryRecord.serialNumber) ' +
        'FILTER (WHERE inventoryRecord.serialNumber IS NOT NULL), ARRAY[]::text[])' +
        'as "serialNumbers"',
      'TO_JSONB(asset) as asset',
      'TO_JSONB(author) as author',
      'row."prevValue"::text as "prevValue"',
      'row."nextValue"::text as "nextValue"',
      ...restGroupingAttrs.map((attr) => `row."${attr}" as "${attr}"`),
    ]);

    if (filtration) {
      builder.where(this.prepareFiltration(filtration));
    }

    builder.orderBy(order as OrderByCondition);

    const { items: rawItems, totalCount } = await withPaging(builder, paging);

    type RawItem = Omit<InventoryLog, 'inventoryRecord'> & {
      asset: Asset;
      count: number;
      inventoryRecordId: number;
      serialNumbers: string[];
    };

    const items = (rawItems as RawItem[]).map((item) =>
      item.count > 1 ? omit(item, ['id', 'inventoryRecordId']) : item,
    );

    const usedEntities = await this.findUsedEntities(items);

    return { items, totalCount, usedEntities };
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
    const statusesIds = new Set<number>();

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
        case 'statusId':
          addTo(statusesIds);
      }
    });

    const [locations, responsibles, statuses] = await Promise.all([
      this.locationsService.findByIds([...locationsIds]),
      this.responsibleService.findByIds([...responsiblesIds]),
      this.statusService.findByIds([...statusesIds]),
    ]);

    return { locations, responsibles, statuses } as const;
  }
}
