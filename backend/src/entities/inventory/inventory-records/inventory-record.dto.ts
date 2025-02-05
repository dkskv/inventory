import {
  ObjectType,
  Field,
  Int,
  createUnionType,
  InputType,
} from '@nestjs/graphql';
import { AssetDto } from 'src/entities/catalogs/assets/asset.dto';
import { LocationDto } from 'src/entities/catalogs/locations/location.dto';
import { ResponsibleDto } from 'src/entities/catalogs/responsibles/responsible.dto';
import { PagedArrayClassOf } from 'src/shared/dto/paged.dto';
import { Filtration } from './inventory-record.service';

@InputType()
export class InventoryRecordsFiltrationInput implements Filtration {
  @Field(() => [Int], { nullable: true })
  locationIds?: number[];

  @Field(() => [Int], { nullable: true })
  assetIds?: number[];

  @Field(() => [Int], { nullable: true })
  responsibleIds?: number[];

  @Field(() => String, { nullable: true })
  serialNumberSearchText?: string;

  @Field(() => String, { nullable: true })
  descriptionSearchText?: string;
}

@ObjectType()
abstract class BaseInventoryRecordDto {
  @Field(() => LocationDto)
  location: LocationDto;

  @Field(() => AssetDto)
  asset: AssetDto;

  @Field(() => ResponsibleDto)
  responsible: ResponsibleDto;
}

@ObjectType()
export class InventoryRecordDto extends BaseInventoryRecordDto {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  serialNumber: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;
}

@ObjectType()
export class InventoryRecordsGroupDto extends BaseInventoryRecordDto {
  @Field(() => Int)
  count: number;
}

export const InventoryRecordOrGroupDto = createUnionType({
  name: 'InventoryRecordOrGroupDto',
  types: () => [InventoryRecordDto, InventoryRecordsGroupDto] as const,
  resolveType(value: InventoryRecordDto | InventoryRecordsGroupDto) {
    return 'count' in value ? InventoryRecordsGroupDto : InventoryRecordDto;
  },
});

@ObjectType()
export class InventoryRecordsPagedDto extends PagedArrayClassOf(
  InventoryRecordDto,
) {}

@ObjectType()
export class InventoryRecordsOrGroupsPagedDto extends PagedArrayClassOf(
  InventoryRecordOrGroupDto,
) {}
