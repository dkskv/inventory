import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTokensDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
