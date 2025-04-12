import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './status.entity';
import { CatalogEntityService } from '../shared/service/catalog-entity.service';

@Injectable()
export class StatusService extends CatalogEntityService<Status> {
  constructor(
    @InjectRepository(Status)
    repository: Repository<Status>,
  ) {
    super(repository);
  }
}
