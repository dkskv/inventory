import {
  Repository,
  DeepPartial,
  FindOptionsOrder,
  FindManyOptions,
} from 'typeorm';
import { PagedArray, Paging } from './paging';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T extends { id: number }> {
  constructor(protected readonly repository: Repository<T>) {}

  async findPagedItems(
    paging: Paging,
    options?: Omit<FindManyOptions<T>, 'skip' | 'take'>,
  ): Promise<PagedArray<T>> {
    const [items, totalCount] = await this.repository.findAndCount({
      ...options,
      skip: paging.offset,
      take: paging.limit,
      order: { id: 'DESC' } as FindOptionsOrder<T>,
    });

    return { items, totalCount };
  }

  async create(entity: DeepPartial<T>, count = 1): Promise<void> {
    const newEntity = this.repository.create(entity);

    await this.repository.insert(
      Array.from<QueryDeepPartialEntity<T>>({
        length: count,
      }).fill(newEntity as QueryDeepPartialEntity<T>),
    );
  }

  async update(...args: Parameters<Repository<T>['update']>): Promise<void> {
    await this.repository.update(...args);
  }

  async delete(...args: Parameters<Repository<T>['delete']>): Promise<void> {
    await this.repository.delete(...args);
  }
}
