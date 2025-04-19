import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  DeleteQueryBuilder,
  In,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import { InventoryRecord } from './inventory-record.entity';
import { Paging } from 'src/shared/service/paging';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { withPaging } from 'src/shared/service/with-paging';
import { omit } from 'lodash';

export interface Filtration {
  ids?: number[];
  assetIds?: number[];
  locationIds?: number[];
  responsibleIds?: number[];
  serialNumberSearchText?: string;
  descriptionSearchText?: string;
  statusesIds?: number[];
}

@Injectable()
export class InventoryRecordService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryRecord)
    private readonly repository: Repository<InventoryRecord>,
  ) {}

  public prepareBaseEntity(values: {
    locationId?: number;
    responsibleId?: number;
    assetId?: number;
    serialNumber?: string;
    description?: string;
    statusesIds?: number[];
  }): DeepPartial<InventoryRecord> {
    return {
      location:
        values.locationId === undefined ? undefined : { id: values.locationId },
      responsible:
        values.responsibleId === undefined
          ? undefined
          : { id: values.responsibleId },
      asset: values.assetId === undefined ? undefined : { id: values.assetId },
      serialNumber: values.serialNumber === '' ? null : values.serialNumber,
      description: values.description === '' ? null : values.description,
      statuses: values.statusesIds
        ? values.statusesIds.map((id) => ({ id }))
        : undefined,
    };
  }

  private applyFiltration(
    qb: SelectQueryBuilder<InventoryRecord>,
    filtration: Filtration,
  ) {
    // Защита от случайного изменения всей таблицы
    if (Object.keys(filtration).length === 0) {
      throw new Error('Empty filtration');
    }

    const { alias } = qb;

    if (filtration.ids?.length) {
      qb.andWhere(`${alias}.id IN (:...ids)`, {
        ids: filtration.ids,
      });
    }

    if (filtration.assetIds?.length) {
      qb.andWhere('asset.id IN (:...assetIds)', {
        assetIds: filtration.assetIds,
      });
    }

    if (filtration.locationIds?.length) {
      qb.andWhere('location.id IN (:...locationIds)', {
        locationIds: filtration.locationIds,
      });
    }

    if (filtration.responsibleIds?.length) {
      qb.andWhere('responsible.id IN (:...responsibleIds)', {
        responsibleIds: filtration.responsibleIds,
      });
    }

    if (filtration.serialNumberSearchText) {
      qb.andWhere(`${alias}.serialNumber ILIKE :serialNumber`, {
        serialNumber: `%${filtration.serialNumberSearchText}%`,
      });
    }

    if (filtration.descriptionSearchText) {
      qb.andWhere(`${alias}.description ILIKE :descriptionSearchText`, {
        descriptionSearchText: `%${filtration.descriptionSearchText}%`,
      });
    }

    if (filtration.statusesIds?.length) {
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('inventory_record_statuses_status', 'ir2s')
          .where(`ir2s.inventoryRecordId = ${alias}.id`)
          .andWhere('ir2s.statusId IN (:...statusesIds)')
          .getQuery();

        return `EXISTS ${subQuery}`;
      }).setParameter('statusesIds', filtration.statusesIds);
    }

    return qb;
  }

  async findAll(paging: Paging, filtration?: Filtration) {
    const qb = this.repository
      .createQueryBuilder('inventoryRecord')
      .leftJoinAndSelect('inventoryRecord.asset', 'asset')
      .leftJoinAndSelect('inventoryRecord.location', 'location')
      .leftJoinAndSelect('inventoryRecord.responsible', 'responsible')
      .leftJoinAndSelect('inventoryRecord.statuses', 'status');

    if (filtration) {
      this.applyFiltration(qb, filtration);
    }

    qb.skip(paging.offset).take(paging.limit);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  private joinConnections(qb: SelectQueryBuilder<InventoryRecord>) {
    const { alias } = qb;

    qb.leftJoin(`${alias}.asset`, 'asset')
      .leftJoin(`${alias}.location`, 'location')
      .leftJoin(`${alias}.responsible`, 'responsible')
      .leftJoin(`${alias}.statuses`, 'status');
  }

  async findAllItemsOrGroups(paging: Paging, filtration?: Filtration) {
    const qb = this.dataSource
      .createQueryBuilder()
      .from(InventoryRecord, 'inventoryRecord')

      .addGroupBy('asset.id')
      .addGroupBy('location.id')
      .addGroupBy('responsible.id')

      .addSelect('TO_JSONB(asset)', 'asset')
      .addSelect('TO_JSONB(location)', 'location')
      .addSelect('TO_JSONB(responsible)', 'responsible')
      .addSelect(
        `
        CASE 
          WHEN COUNT(DISTINCT inventoryRecord.id) > 1 THEN NULL
          ELSE COALESCE(
            jsonb_agg(TO_JSONB(status)) FILTER (WHERE status.id IS NOT NULL),
            '[]'::jsonb
          )
        END
        `,
        'statuses',
      )

      .addSelect('MIN(inventoryRecord.id)', 'id')
      .addSelect('MIN(inventoryRecord.serialNumber)', 'serialNumber')
      .addSelect('MIN(inventoryRecord.description)', 'description')

      .addSelect('COUNT(DISTINCT inventoryRecord.id)::integer', 'count');

    this.joinConnections(qb);

    if (filtration) {
      this.applyFiltration(qb, filtration);
    }

    qb.orderBy({ id: 'DESC' });

    const { items: rawItems, totalCount } = await withPaging(qb, paging);

    type RawItem = InventoryRecord & {
      count: number;
    };

    const items = (rawItems as RawItem[]).map((item) =>
      item.count > 1
        ? omit(item, ['id', 'statuses', 'serialNumber', 'description'])
        : omit(item, ['count']),
    );

    return { items, totalCount };
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  // todo: поддержать статусы в выгрузке excel
  async findDetailedGroups(limit: number, filtration?: Filtration) {
    const qb = this.repository
      .createQueryBuilder('row')
      .innerJoin('row.location', 'location')
      .innerJoin('row.asset', 'asset')
      .innerJoin('row.responsible', 'responsible')
      .select([
        'TO_JSONB(location) AS location',
        'TO_JSONB(asset) AS asset',
        'TO_JSONB(responsible) AS responsible',
        'COUNT(*)::int AS count',
        'COALESCE(ARRAY_AGG(row.serialNumber) ' +
          'FILTER (WHERE row.serialNumber IS NOT NULL), ARRAY[]::text[])' +
          'as "serialNumbers"',
      ])
      .groupBy('location.id, asset.id, responsible.id')
      .limit(limit + 1);

    if (filtration) {
      this.applyFiltration(qb, filtration);
    }

    const result = await qb.getRawMany();

    if (result.length > limit) {
      throw new Error(`Exceeds limit of ${limit} rows`);
    }

    return result as {
      location: Location;
      asset: Asset;
      responsible: Responsible;
      count: number;
      serialNumbers: string[];
    }[];
  }

  private async executeInTransaction(
    execute: (queryRunner: QueryRunner) => Promise<void>,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await execute(queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(
    actingUserId: number,
    entity: DeepPartial<InventoryRecord>,
    count = 1,
  ): Promise<void> {
    await this.executeInTransaction(async (queryRunner) => {
      await queryRunner.query(`SET LOCAL var.user_id = '${actingUserId}'`);

      const records = Array.from({ length: count }).map(() =>
        queryRunner.manager.create(InventoryRecord, entity),
      );

      await queryRunner.manager.save(records);
    });
  }

  // todo: оптимизировать после покрытия тестами
  async updateByFiltration(
    actingUserId: number,
    filtration: Filtration,
    partialEntity: QueryDeepPartialEntity<InventoryRecord>,
  ) {
    await this.executeInTransaction(async (queryRunner) => {
      const qb = queryRunner.manager.createQueryBuilder(
        InventoryRecord,
        'inventoryRecord',
      );

      this.joinConnections(qb);
      this.applyFiltration(qb, filtration);

      const entitiesToUpdate = await qb.getMany();

      entitiesToUpdate.forEach((entity) =>
        Object.assign(entity, partialEntity),
      );

      await queryRunner.query(`SET LOCAL var.user_id = '${actingUserId}'`);
      await queryRunner.manager.save(entitiesToUpdate);
    });
  }

  // todo: оптимизировать после покрытия тестами
  async deleteByFiltration(filtration: Filtration) {
    const qb = this.repository
      .createQueryBuilder('inventoryRecord')
      .select('inventoryRecord.id');

    this.joinConnections(qb);
    this.applyFiltration(qb, filtration);

    const ids = (await qb.getMany()).map((r) => r.id);

    await this.repository.delete({ id: In(ids) });
  }
}
