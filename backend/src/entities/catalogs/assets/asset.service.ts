import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CatalogEntityService } from '../shared/service/catalog-entity.service';

@Injectable()
export class AssetService extends CatalogEntityService<Asset> {
  constructor(
    @InjectRepository(Asset)
    repository: Repository<Asset>,
  ) {
    super(repository);
  }
}
