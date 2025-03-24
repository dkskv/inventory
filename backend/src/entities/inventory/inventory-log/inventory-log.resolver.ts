import { Resolver, Query, Args } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { InventoryLogService } from './inventory-log.service';
import {
  Action,
  InventoryAttribute,
  InventoryLogsPagedDto,
  InventoryLogsOrGroupsPagedDto,
  InventoryLogsFiltrationInput,
} from './inventory-log.dto';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { compact } from 'lodash';

@UseGuards(GqlAuthGuard)
@Resolver()
export class InventoryLogResolver {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  @Query(() => InventoryLogsOrGroupsPagedDto)
  async inventoryLogsOrGroups(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryLogsFiltrationInput,
  ): Promise<InventoryLogsOrGroupsPagedDto> {
    const { items, ...rest } =
      await this.inventoryLogService.findAllItemsOrGroups(paging, filtration);

    return {
      ...rest,
      items: items.map((item) => ({
        ...item,
        action: item.action as Action,
        attribute: item.attribute as InventoryAttribute,
      })),
    };
  }

  @Query(() => InventoryLogsPagedDto)
  async inventoryLogs(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryLogsFiltrationInput,
  ): Promise<InventoryLogsPagedDto> {
    const { items, ...rest } = await this.inventoryLogService.findAll(
      paging,
      filtration,
    );

    return {
      ...rest,
      items: items.map(({ inventoryRecord, ...item }) => ({
        ...item,
        inventoryRecordId: inventoryRecord.id,
        asset: inventoryRecord.asset,
        serialNumbers: compact([inventoryRecord.serialNumber]),
        action: item.action as Action,
        attribute: item.attribute as InventoryAttribute,
      })),
    };
  }
}
