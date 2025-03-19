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
import { InventoryLog } from './inventory-log.entity';

@UseGuards(GqlAuthGuard)
@Resolver()
export class InventoryLogResolver {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  private mapEntityToDto<
    T extends
      | InventoryLog
      | (Omit<InventoryLog, 'id' | 'inventoryRecord'> & { count: number }),
  >(entity: T) {
    return {
      ...entity,
      action: entity.action as Action,
      attribute: entity.attribute as InventoryAttribute,
    };
  }

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
      items: items.map((i) => this.mapEntityToDto(i)),
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
      items: items.map((i) => this.mapEntityToDto(i)),
    };
  }
}
