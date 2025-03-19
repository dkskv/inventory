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
import { findWithGroupingAndCount } from 'src/shared/service/find-with-grouping-and-count';
import { isNil, isNumber } from 'lodash';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';

export interface Filtration {
  timestamp?: Date | null;
  authorId?: number | null;
  action?: string | null;
  attribute?: string | null;
  prevValue?: string | null;
  nextValue?: string | null;
  inventoryRecordIds?: number[];
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
    const [items, totalCount] = await findWithGroupingAndCount({
      dataSource: this.dataSource,
      entityClass: InventoryLog,
      groupAttributes: [
        'timestamp',
        'author',
        'action',
        'attribute',
        'prevValue',
        'nextValue',
      ],
      paging,
      where: filtration && this.prepareFiltration(filtration),
      order: { id: 'DESC' },
    });

    const { locations: usedLocations, responsibles: usedResponsibles } =
      await this.findUsedEntities(items);

    return { items, totalCount, usedLocations, usedResponsibles };
  }

  private async findUsedEntities(
    logs: Pick<InventoryLog, 'attribute' | 'prevValue' | 'nextValue'>[],
  ) {
    const locationsIds = new Set<number>();
    const responsiblesIds = new Set<number>();

    logs.forEach((log) => {
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
