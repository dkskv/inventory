import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  InventoryRecordDto,
  InventoryRecordsDetailedGroupDto,
  InventoryRecordsFiltrationInput,
  InventoryRecordsOrGroupsPagedDto,
  InventoryRecordsPagedDto,
} from './inventory-record.dto';
import { InventoryRecordService } from './inventory-record.service';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { Int } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUserIdGql } from 'src/shared/resolver/current-user-id-param';
import {
  GqlAccessControlGuard,
  RequirePermissions,
} from 'src/access-control/access-control.guard';
import { Permission, Privilege } from 'src/access-control/access-control.const';

@UseGuards(GqlAuthGuard, GqlAccessControlGuard)
@Resolver()
export class InventoryRecordResolver {
  constructor(
    private readonly inventoryRecordService: InventoryRecordService,
  ) {}

  /** Инвентарные записи с группировкой похожих */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.READ })
  @Query(() => InventoryRecordsOrGroupsPagedDto)
  async inventoryRecordsOrGroups(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryRecordsFiltrationInput,
  ): Promise<InventoryRecordsOrGroupsPagedDto> {
    return this.inventoryRecordService.findAllItemsOrGroups(paging, filtration);
  }

  @RequirePermissions({ [Privilege.INVENTORY]: Permission.READ })
  @Query(() => InventoryRecordsPagedDto)
  async inventoryRecords(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryRecordsFiltrationInput,
  ): Promise<InventoryRecordsPagedDto> {
    return this.inventoryRecordService.findAll(paging, filtration);
  }

  @RequirePermissions({ [Privilege.INVENTORY]: Permission.READ })
  @Query(() => [InventoryRecordsDetailedGroupDto])
  async inventoryRecordsDetailedGroups(
    @Args('filtration', { nullable: true })
    filtration?: InventoryRecordsFiltrationInput,
  ): Promise<InventoryRecordsDetailedGroupDto[]> {
    // todo: брать из .env или настраивать через UI
    const limit = 200;

    return this.inventoryRecordService.findDetailedGroups(limit, filtration);
  }

  @RequirePermissions({ [Privilege.INVENTORY]: Permission.READ })
  @Query(() => InventoryRecordDto, { nullable: true })
  async inventoryRecordById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<InventoryRecordDto | null> {
    return this.inventoryRecordService.findById(id);
  }

  /** Создать одну инвентарную запись с возможностью указать серийный номер */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.CREATE })
  @Mutation(() => Boolean)
  async createInventoryRecord(
    @CurrentUserIdGql() currentUserId: number,
    @Args('locationId', { type: () => Int }) locationId: number,
    @Args('responsibleId', { type: () => Int }) responsibleId: number,
    @Args('assetId', { type: () => Int }) assetId: number,
    @Args('serialNumber', { nullable: true }) serialNumber: string,
    @Args('description', { nullable: true }) description: string,
    @Args('statusesIds', { type: () => [Int], nullable: true })
    statusesIds?: number[],
  ): Promise<boolean> {
    const baseEntity = this.inventoryRecordService.prepareBaseEntity({
      locationId,
      responsibleId,
      assetId,
      serialNumber,
      description,
      statusesIds,
    });

    await this.inventoryRecordService.create(currentUserId, baseEntity);

    return true;
  }

  /** Создать одинаковые инвентарные записи без серийного номера */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.CREATE })
  @Mutation(() => Boolean)
  async createInventoryRecordsBatch(
    @CurrentUserIdGql() currentUserId: number,
    @Args('locationId', { type: () => Int }) locationId: number,
    @Args('responsibleId', { type: () => Int }) responsibleId: number,
    @Args('assetId', { type: () => Int }) assetId: number,
    @Args('count', { type: () => Int }) count: number,
    @Args('description', { nullable: true }) description: string,
    @Args('statusesIds', { type: () => [Int], nullable: true })
    statusesIds?: number[],
  ): Promise<boolean> {
    const baseEntity = this.inventoryRecordService.prepareBaseEntity({
      locationId,
      responsibleId,
      assetId,
      description,
      statusesIds,
    });

    await this.inventoryRecordService.create(currentUserId, baseEntity, count);

    return true;
  }

  /** Обновить одну инвентарную запись с возможностью указать серийный номер  */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.UPDATE })
  @Mutation(() => Boolean)
  async updateInventoryRecord(
    @CurrentUserIdGql() currentUserId: number,
    @Args('id', { type: () => Int }) id: number,
    @Args('locationId', { type: () => Int }) locationId: number,
    @Args('responsibleId', { type: () => Int }) responsibleId: number,
    @Args('serialNumber', { nullable: true }) serialNumber: string,
    @Args('description', { nullable: true }) description: string,
    @Args('statusesIds', { type: () => [Int], nullable: true })
    statusesIds?: number[],
  ): Promise<boolean> {
    const baseEntity = this.inventoryRecordService.prepareBaseEntity({
      locationId,
      responsibleId,
      serialNumber,
      description,
      statusesIds,
    });

    await this.inventoryRecordService.updateByFiltration(
      currentUserId,
      { ids: [id] },
      baseEntity,
    );

    return true;
  }

  /** Обновить группировку инвентарных записей */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.UPDATE })
  @Mutation(() => Boolean)
  async updateInventoryRecordsBatch(
    @CurrentUserIdGql() currentUserId: number,
    @Args('ids', { type: () => [Int] }) ids: number[],
    @Args('locationId', { type: () => Int, nullable: true })
    locationId?: number,
    @Args('responsibleId', { type: () => Int, nullable: true })
    responsibleId?: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('statusesIds', { type: () => [Int], nullable: true })
    statusesIds?: number[],
  ): Promise<boolean> {
    const baseEntity = this.inventoryRecordService.prepareBaseEntity({
      locationId,
      responsibleId,
      description,
      statusesIds,
    });

    await this.inventoryRecordService.updateByFiltration(
      currentUserId,
      { ids },
      baseEntity,
    );

    return true;
  }

  @RequirePermissions({ [Privilege.INVENTORY]: Permission.UPDATE })
  @Mutation(() => Boolean)
  async updateInventoryRecordsByFiltration(
    @CurrentUserIdGql() currentUserId: number,
    @Args('filtration') filtration: InventoryRecordsFiltrationInput,
    @Args('locationId', { type: () => Int, nullable: true })
    locationId?: number,
    @Args('responsibleId', { type: () => Int, nullable: true })
    responsibleId?: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('statusesIds', { type: () => [Int], nullable: true })
    statusesIds?: number[],
  ): Promise<boolean> {
    const baseEntity = this.inventoryRecordService.prepareBaseEntity({
      locationId,
      responsibleId,
      description,
      statusesIds,
    });

    await this.inventoryRecordService.updateByFiltration(
      currentUserId,
      filtration,
      baseEntity,
    );

    return true;
  }

  /** Удалить инвентарные записи по id */
  @RequirePermissions({ [Privilege.INVENTORY]: Permission.DELETE })
  @Mutation(() => Boolean)
  async deleteInventoryRecordsBatch(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ) {
    await this.inventoryRecordService.deleteByFiltration({ ids });

    return true;
  }

  @RequirePermissions({ [Privilege.INVENTORY]: Permission.DELETE })
  @Mutation(() => Boolean)
  async deleteInventoryRecordsByFiltration(
    @Args('filtration') filtration: InventoryRecordsFiltrationInput,
  ) {
    await this.inventoryRecordService.deleteByFiltration(filtration);

    return true;
  }
}
