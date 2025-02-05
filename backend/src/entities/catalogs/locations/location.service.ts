import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CatalogEntityService } from '../shared/service/catalog-entity.service';

@Injectable()
export class LocationService extends CatalogEntityService<Location> {
  constructor(
    @InjectRepository(Location)
    repository: Repository<Location>,
  ) {
    super(repository);
  }
}
