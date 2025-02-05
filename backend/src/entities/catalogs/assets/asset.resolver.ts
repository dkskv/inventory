import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AssetPagedArrayDto } from './asset.dto';
import { AssetService } from './asset.service';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { Int } from '@nestjs/graphql';
import { CatalogFiltrationInput } from '../shared/dto/catalog-filtration-input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}

  @Query(() => AssetPagedArrayDto)
  async assets(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true }) filtration?: CatalogFiltrationInput,
  ): Promise<AssetPagedArrayDto> {
    return this.assetService.findPagedFilteredItems(paging, filtration);
  }

  @Mutation(() => Boolean)
  async createAsset(@Args('name') name: string): Promise<boolean> {
    await this.assetService.create({ name });

    return true;
  }

  @Mutation(() => Boolean)
  async updateAsset(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    await this.assetService.update(id, { name });

    return true;
  }

  @Mutation(() => Boolean)
  async deleteAsset(@Args('id', { type: () => Int }) id: number) {
    await this.assetService.delete(id);

    return true;
  }
}
