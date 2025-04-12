import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StatusPagedArrayDto } from './status.dto';
import { StatusService } from './status.service';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { CatalogFiltrationInput } from '../shared/dto/catalog-filtration-input';
import { Int } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(GqlAuthGuard)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => StatusPagedArrayDto)
  async statuses(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true }) filtration?: CatalogFiltrationInput,
  ): Promise<StatusPagedArrayDto> {
    return this.statusService.findPagedFilteredItems(paging, filtration);
  }

  @Mutation(() => Boolean)
  async createStatus(
    @Args('name') name: string,
    @Args('color') color: string,
  ): Promise<boolean> {
    await this.statusService.create({ name, color });

    return true;
  }

  @Mutation(() => Boolean)
  async updateStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('color', { nullable: true }) color?: string,
  ) {
    await this.statusService.update(id, { name, color });

    return true;
  }

  @Mutation(() => Boolean)
  async deleteStatus(@Args('id', { type: () => Int }) id: number) {
    await this.statusService.delete(id);

    return true;
  }
}
