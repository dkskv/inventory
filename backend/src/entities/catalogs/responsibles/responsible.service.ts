import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsible } from './responsible.entity';
import { CatalogEntityService } from '../shared/service/catalog-entity.service';

@Injectable()
export class ResponsibleService extends CatalogEntityService<Responsible> {
  constructor(
    @InjectRepository(Responsible)
    repository: Repository<Responsible>,
  ) {
    super(repository);
  }
}
