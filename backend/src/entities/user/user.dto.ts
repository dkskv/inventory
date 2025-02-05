import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { PagedArrayClassOf } from 'src/shared/dto/paged.dto';
import { UsersFiltration } from './user.service';
import { AccessRole } from 'src/access-control/access-control.const';
import { PrivilegeAccessDto } from 'src/access-control/access-control.dto';

@InputType()
export class UsersFiltrationInput implements UsersFiltration {
  @Field({ nullable: true })
  searchText?: string;
}

@ObjectType()
export class UserDto {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(() => AccessRole)
  accessRole: AccessRole;
}

@ObjectType()
export class UserPagedArrayDto extends PagedArrayClassOf(UserDto) {}

@ObjectType()
export class UserWithPrivilegesDto {
  @Field(() => UserDto)
  user: UserDto;

  @Field(() => [PrivilegeAccessDto])
  privileges: PrivilegeAccessDto[];
}
