import {
  createUnionType,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { PagedArrayClassOf } from 'src/shared/dto/paged.dto';
import { Filtration } from './inventory-log.service';
import { AssetDto } from 'src/entities/catalogs/assets/asset.dto';
import { UserDto } from 'src/entities/user/user.dto';
import { LocationDto } from 'src/entities/catalogs/locations/location.dto';
import { ResponsibleDto } from 'src/entities/catalogs/responsibles/responsible.dto';

export enum Action {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

registerEnumType(Action, { name: 'Action' });

export enum InventoryAttribute {
  assetId = 'assetId',
  locationId = 'locationId',
  responsibleId = 'responsibleId',
  serialNumber = 'serialNumber',
  description = 'description',
}

registerEnumType(InventoryAttribute, { name: 'InventoryAttribute' });

@InputType()
export class InventoryLogsFiltrationInput implements Filtration {
  @Field(() => Date, { nullable: true })
  timestamp?: Date;

  @Field(() => Int, { nullable: true })
  authorId?: number;

  @Field(() => Action, { nullable: true })
  action?: Action | null;

  @Field(() => InventoryAttribute, { nullable: true })
  attribute?: InventoryAttribute | null;

  @Field(() => String, { nullable: true })
  nextValue?: string | null;

  @Field(() => String, { nullable: true })
  prevValue?: string | null;

  @Field(() => [Int], { nullable: true })
  inventoryRecordIds?: number[];

  @Field(() => Int, { nullable: true })
  assetId?: number;
}

@ObjectType()
abstract class BaseInventoryLogDto {
  @Field(() => Date)
  timestamp: Date;

  @Field(() => UserDto, { nullable: true })
  author: UserDto | null;

  @Field(() => AssetDto)
  asset: AssetDto;

  @Field(() => [String])
  serialNumbers: string[];

  @Field(() => Action)
  action: Action;

  @Field(() => InventoryAttribute, { nullable: true })
  attribute: InventoryAttribute | null;

  @Field(() => String, { nullable: true })
  prevValue: string | null;

  @Field(() => String, { nullable: true })
  nextValue: string | null;
}

@ObjectType()
export class InventoryLogDto extends BaseInventoryLogDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  inventoryRecordId: number;
}

@ObjectType()
export class InventoryLogsGroupDto extends BaseInventoryLogDto {
  @Field(() => Int)
  count: number;
}

export const InventoryLogOrGroupDto = createUnionType({
  name: 'InventoryLogOrGroupDto',
  types: () => [InventoryLogDto, InventoryLogsGroupDto] as const,
  resolveType(value: InventoryLogDto | InventoryLogsGroupDto) {
    return 'id' in value ? InventoryLogDto : InventoryLogsGroupDto;
  },
});

@ObjectType()
export class InventoryLogsPagedDto extends PagedArrayClassOf(InventoryLogDto) {
  @Field(() => [LocationDto])
  usedLocations: LocationDto[];

  @Field(() => [ResponsibleDto])
  usedResponsibles: ResponsibleDto[];
}

@ObjectType()
export class InventoryLogsOrGroupsPagedDto extends PagedArrayClassOf(
  InventoryLogOrGroupDto,
) {
  @Field(() => [LocationDto])
  usedLocations: LocationDto[];

  @Field(() => [ResponsibleDto])
  usedResponsibles: ResponsibleDto[];
}
