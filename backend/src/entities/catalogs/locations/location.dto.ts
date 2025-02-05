import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PagedArrayClassOf } from 'src/shared/dto/paged.dto';

@ObjectType()
export class LocationDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class LocationPagedArrayDto extends PagedArrayClassOf(LocationDto) {}
