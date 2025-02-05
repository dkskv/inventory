import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocationPagedArrayDto } from './location.dto';
import { LocationService } from './location.service';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { CatalogFiltrationInput } from '../shared/dto/catalog-filtration-input';
import { Int } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(GqlAuthGuard)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Query(() => LocationPagedArrayDto)
  async locations(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true }) filtration?: CatalogFiltrationInput,
  ): Promise<LocationPagedArrayDto> {
    return this.locationService.findPagedFilteredItems(paging, filtration);
  }

  @Mutation(() => Boolean)
  async createLocation(@Args('name') name: string): Promise<boolean> {
    await this.locationService.create({ name });

    return true;
  }

  @Mutation(() => Boolean)
  async updateLocation(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    await this.locationService.update(id, { name });

    return true;
  }

  @Mutation(() => Boolean)
  async deleteLocation(@Args('id', { type: () => Int }) id: number) {
    await this.locationService.delete(id);

    return true;
  }
}
