import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { BaseService } from 'src/shared/service/base.service';
import { PagedArray, Paging } from 'src/shared/service/paging';
import { AccessRole } from 'src/access-control/access-control.const';

export interface UsersFiltration {
  searchText?: string;
}

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  private getSearchOptionsWhere(searchText: string) {
    return {
      username: Like(`%${searchText}%`),
    };
  }

  async findAll(
    paging: Paging,
    filtration?: UsersFiltration,
  ): Promise<PagedArray<User>> {
    const where = filtration?.searchText
      ? this.getSearchOptionsWhere(filtration.searchText)
      : undefined;

    return this.findPagedItems(paging, { where });
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async findByUsernameOrFail(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

  async hasUserWithRole(accessRole: AccessRole) {
    return (await this.repository.findOneBy({ accessRole })) !== null;
  }
}
