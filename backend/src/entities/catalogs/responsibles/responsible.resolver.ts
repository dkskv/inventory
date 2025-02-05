import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ResponsiblePagedArrayDto } from './responsible.dto';
import { ResponsibleService } from './responsible.service';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { Int } from '@nestjs/graphql';
import { CatalogFiltrationInput } from '../shared/dto/catalog-filtration-input';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ResponsibleResolver {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Query(() => ResponsiblePagedArrayDto)
  async responsibles(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true }) filtration?: CatalogFiltrationInput,
  ): Promise<ResponsiblePagedArrayDto> {
    return this.responsibleService.findPagedFilteredItems(paging, filtration);
  }

  @Mutation(() => Boolean)
  async createResponsible(@Args('name') name: string): Promise<boolean> {
    await this.responsibleService.create({ name });

    return true;
  }

  @Mutation(() => Boolean)
  async updateResponsible(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    await this.responsibleService.update(id, { name });

    return true;
  }

  @Mutation(() => Boolean)
  async deleteResponsible(@Args('id', { type: () => Int }) id: number) {
    await this.responsibleService.delete(id);

    return true;
  }
}
