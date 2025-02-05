import { InputType, Field, Int } from '@nestjs/graphql';
import { Paging } from '../service/paging';

@InputType()
export class PagingInput implements Paging {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
