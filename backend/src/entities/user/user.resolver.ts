import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PagingInput } from 'src/shared/resolver/paging-input';
import { Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  UsersFiltrationInput,
  UserPagedArrayDto,
  UserWithPrivilegesDto,
} from './user.dto';
import { UseGuards } from '@nestjs/common';
import {
  AccessControlGuard,
  RequirePermissions,
} from 'src/access-control/access-control.guard';
import {
  accessScheme,
  Permission,
  Privilege,
} from 'src/access-control/access-control.const';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUserId } from 'src/shared/resolver/current-user-id-param';

@UseGuards(GqlAuthGuard, AccessControlGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserWithPrivilegesDto, { nullable: true })
  async currentUserWithPrivileges(
    @CurrentUserId() currentUserId,
  ): Promise<UserWithPrivilegesDto | null> {
    const user = await this.userService.findById(currentUserId);

    if (!user) {
      return null;
    }

    return {
      user,
      privileges: Object.entries(accessScheme[user.accessRole]).map(
        ([name, permissions]: [Privilege, number]) => ({ name, permissions }),
      ),
    };
  }

  @RequirePermissions({ [Privilege.USERS]: Permission.READ })
  @Query(() => UserPagedArrayDto)
  async users(
    @Args('paging') paging: PagingInput,
    @Args('filtration', { nullable: true }) filtration?: UsersFiltrationInput,
  ): Promise<UserPagedArrayDto> {
    return this.userService.findAll(paging, filtration);
  }

  @RequirePermissions({ [Privilege.USERS]: Permission.DELETE })
  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    await this.userService.delete(id);

    return true;
  }
}
