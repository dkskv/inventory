import { BaseService } from 'src/shared/service/base.service';
import { PagedArray, Paging } from 'src/shared/service/paging';
import { FindOptionsWhere, Like, In } from 'typeorm';

export interface CatalogFiltration {
  searchText?: string;
}

export class CatalogEntityService<
  T extends { id: number; name: string },
> extends BaseService<T> {
  private getSearchOptionsWhere(searchText: string) {
    return {
      name: Like(`%${searchText}%`),
    } as FindOptionsWhere<T>;
  }

  async findPagedFilteredItems(
    paging: Paging,
    filtration?: CatalogFiltration,
  ): Promise<PagedArray<T>> {
    const where = filtration?.searchText
      ? this.getSearchOptionsWhere(filtration.searchText)
      : undefined;

    return this.findPagedItems(paging, { where });
  }

  async findByIds(ids: number[]): Promise<T[]> {
    return this.repository.find({
      where: { id: In(ids) } as FindOptionsWhere<T>,
    });
  }
}
