import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryRecord } from './inventory-record.entity';
import { InventoryRecordService } from './inventory-record.service';
import { InventoryRecordResolver } from './inventory-record.resolver';
import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { AccessControlModule } from 'src/access-control/access-control.module';

@Module({
  imports: [
    AccessControlModule,
    TypeOrmModule.forFeature([InventoryRecord, Asset, Location, Responsible]),
  ],
  providers: [InventoryRecordService, InventoryRecordResolver],
})
export class InventoryRecordModule {}
