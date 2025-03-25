import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TgNotificationsService } from './tg-notifications.service';
import { InventoryLogModule } from 'src/entities/inventory/inventory-log/inventoty-log.module';

@Module({
  imports: [InventoryLogModule],
  providers: [TgNotificationsService],
})
export class TgNotificationsModule implements OnModuleInit, OnModuleDestroy {
  constructor(private service: TgNotificationsService) {}

  async onModuleInit() {
    await this.service.run();
  }

  async onModuleDestroy() {
    await this.service.dispose();
  }
}
