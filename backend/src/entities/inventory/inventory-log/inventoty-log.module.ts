import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLogService } from './inventory-log.service';
import { InventoryLog } from './inventory-log.entity';
import { InventoryLogResolver } from './inventory-log.resolver';
import { LocationService } from 'src/entities/catalogs/locations/location.service';
import { ResponsibleService } from 'src/entities/catalogs/responsibles/responsible.service';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { StatusService } from 'src/entities/catalogs/statuses/status.service';
import { Status } from 'src/entities/catalogs/statuses/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryLog, Location, Responsible, Status]),
  ],
  providers: [
    InventoryLogService,
    InventoryLogResolver,
    LocationService,
    ResponsibleService,
    StatusService,
  ],
  exports: [InventoryLogService],
})
export class InventoryLogModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly inventoryLogService: InventoryLogService) {}

  async onModuleInit() {
    await this.inventoryLogService.createTriggers();
  }

  async onModuleDestroy() {
    await this.inventoryLogService.dropTriggers();
  }
}
