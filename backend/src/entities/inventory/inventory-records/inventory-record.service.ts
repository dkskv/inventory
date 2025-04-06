import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  ILike,
  In,
  QueryRunner,
  Repository,
} from 'typeorm';
import { InventoryRecord } from './inventory-record.entity';
import { Paging } from 'src/shared/service/paging';
import { findWithGroupingAndCount } from 'src/shared/service/find-with-grouping-and-count';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface Filtration {
  assetIds?: number[];
  locationIds?: number[];
  responsibleIds?: number[];
  serialNumberSearchText?: string;
  descriptionSearchText?: string;
}

@Injectable()
export class InventoryRecordService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(InventoryRecord)
    private readonly repository: Repository<InventoryRecord>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Responsible)
    private readonly responsibleRepository: Repository<Responsible>,
    @InjectRepository(Asset)
    private readonly itemRepository: Repository<Asset>,
  ) {}

  public async prepareBaseEntity(values: {
    locationId?: number;
    responsibleId?: number;
    assetId?: number;
    serialNumber?: string;
    description?: string;
  }): Promise<DeepPartial<InventoryRecord>> {
    const [location, responsible, asset] = await Promise.all([
      values.locationId === undefined
        ? undefined
        : this.locationRepository.findOneByOrFail({
            id: values.locationId,
          }),
      values.responsibleId === undefined
        ? undefined
        : this.responsibleRepository.findOneByOrFail({
            id: values.responsibleId,
          }),
      values.assetId === undefined
        ? undefined
        : this.itemRepository.findOneByOrFail({ id: values.assetId }),
    ]);

    return {
      location,
      responsible,
      asset,
      serialNumber: values.serialNumber === '' ? null : values.serialNumber,
      description: values.description === '' ? null : values.description,
    };
  }

  private prepareFiltration(filtration: Filtration) {
    const result: FindOptionsWhere<InventoryRecord> = {};

    if (filtration.assetIds) {
      result.asset = { id: In(filtration.assetIds) };
    }

    if (filtration.locationIds) {
      result.location = { id: In(filtration.locationIds) };
    }

    if (filtration.responsibleIds) {
      result.responsible = { id: In(filtration.responsibleIds) };
    }

    if (filtration.serialNumberSearchText) {
      result.serialNumber = ILike(`%${filtration.serialNumberSearchText}%`);
    }

    if (filtration.descriptionSearchText) {
      result.description = ILike(`%${filtration.descriptionSearchText}%`);
    }

    return result;
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async findAll(paging: Paging, filtration?: Filtration) {
    const [items, totalCount] = await this.repository.findAndCount({
      take: paging.limit,
      skip: paging.offset,
      where: filtration && this.prepareFiltration(filtration),
      order: { id: 'DESC' },
    });

    return { items, totalCount };
  }

  async findAllItemsOrGroups(paging: Paging, filtration?: Filtration) {
    const [items, totalCount] = await findWithGroupingAndCount({
      dataSource: this.dataSource,
      entityClass: InventoryRecord,
      groupAttributes: ['asset', 'location', 'responsible'],
      paging,
      where: filtration && this.prepareFiltration(filtration),
      order: { id: 'DESC' },
    });

    return { items, totalCount };
  }

  async findDetailedGroups(limit: number, filtration?: Filtration) {
    const query = this.repository
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
      query.where(this.prepareFiltration(filtration));
    }

    const result = await query.getRawMany();

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
    const newEntity = this.repository.create(entity);

    await this.executeInTransaction(async (queryRunner) => {
      await queryRunner.query(`SET LOCAL var.user_id = '${actingUserId}'`);
      await queryRunner.manager.insert(
        InventoryRecord,
        Array.from<QueryDeepPartialEntity<InventoryRecord>>({
          length: count,
        }).fill(newEntity),
      );
    });
  }

  public async update(
    actingUserId: number,
    criteria: Parameters<Repository<InventoryRecord>['update']>[0],
    partialEntity: Parameters<Repository<InventoryRecord>['update']>[1],
  ) {
    await this.executeInTransaction(async (queryRunner) => {
      await queryRunner.query(`SET LOCAL var.user_id = '${actingUserId}'`);
      await queryRunner.manager.update(
        InventoryRecord,
        criteria,
        partialEntity,
      );
    });
  }

  async updateByFiltration(
    actingUserId: number,
    filtration: Filtration,
    partialEntity: DeepPartial<InventoryRecord>,
  ) {
    return this.update(
      actingUserId,
      this.prepareFiltration(filtration),
      partialEntity,
    );
  }

  async delete(
    ...args: Parameters<Repository<InventoryRecord>['delete']>
  ): Promise<void> {
    await this.repository.delete(...args);
  }

  async deleteByFiltration(filtration: Filtration) {
    return this.delete(this.prepareFiltration(filtration));
  }
}
