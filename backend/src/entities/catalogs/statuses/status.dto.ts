import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PagedArrayClassOf } from 'src/shared/dto/paged.dto';

@ObjectType()
export class StatusDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  color: string;
}

@ObjectType()
export class StatusPagedArrayDto extends PagedArrayClassOf(StatusDto) {}
