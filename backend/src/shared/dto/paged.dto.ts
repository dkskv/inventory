import { Type } from '@nestjs/common';
import { Field, Int, ObjectType, Union } from '@nestjs/graphql';

export function PagedArrayClassOf<T>(ItemDto: Type<T> | Union<T[]>) {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @Field(() => [ItemDto])
    items: T[];

    @Field(() => Int)
    totalCount: number;
  }

  return PageClass;
}
