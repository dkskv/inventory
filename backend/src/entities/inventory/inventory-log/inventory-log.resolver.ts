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
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';
import { isNumber } from 'lodash';

@UseGuards(GqlAuthGuard)
@Resolver()
export class InventoryLogResolver {
  constructor(
    private readonly inventoryLogService: InventoryLogService,
    private readonly locationsService: LocationService,
    private readonly responsibleService: ResponsibleService,
  ) {}

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

  @Query(() => InventoryLogsOrGroupsPagedDto)
  async inventoryLogsOrGroups(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryLogsFiltrationInput,
  ): Promise<InventoryLogsOrGroupsPagedDto> {
    const { totalCount, items } =
      await this.inventoryLogService.findAllItemsOrGroups(paging, filtration);

    const { locations: usedLocations, responsibles: usedResponsibles } =
      await this.findUsedEntities(items);

    return {
      totalCount,
      items: items.map((i) => this.mapEntityToDto(i)),
      usedLocations,
      usedResponsibles,
    };
  }

  @Query(() => InventoryLogsPagedDto)
  async inventoryLogs(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true })
    filtration?: InventoryLogsFiltrationInput,
  ): Promise<InventoryLogsPagedDto> {
    const { totalCount, items } = await this.inventoryLogService.findAll(
      paging,
      filtration,
    );

    const { locations: usedLocations, responsibles: usedResponsibles } =
      await this.findUsedEntities(items);

    return {
      totalCount,
      items: items.map((i) => this.mapEntityToDto(i)),
      usedLocations,
      usedResponsibles,
    };
  }
}
