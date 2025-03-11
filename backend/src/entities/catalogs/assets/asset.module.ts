import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetService } from './asset.service';
import { AssetResolver } from './asset.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetService, AssetResolver],
})
export class AssetModule {}
