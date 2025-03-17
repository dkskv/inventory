import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from 'src/entities/user/user.service';
import { AuthTokensDto } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './auth.guard';
import {
  GqlAccessControlGuard,
  RequirePermissions,
} from 'src/access-control/access-control.guard';
import { Permission, Privilege } from 'src/access-control/access-control.const';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => AuthTokensDto)
  async signIn(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<AuthTokensDto> {
    const user = await this.authService.authenticateUser(username, password);
    const jwtPayload = AuthService.getJwtPayload(user);

    return this.authService.generateTokens(jwtPayload);
  }

  @Mutation(() => AuthTokensDto)
  async refresh(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthTokensDto> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(GqlAuthGuard, GqlAccessControlGuard)
  @RequirePermissions({ [Privilege.USERS]: Permission.CREATE })
  @Mutation(() => Boolean)
  async signUp(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    this.authService.validatePassword(password);
    const passwordHash = await this.authService.hashPassword(password);
    await this.userService.create({ username, passwordHash });

    return true;
  }

  @UseGuards(GqlAuthGuard, GqlAccessControlGuard)
  @RequirePermissions({ [Privilege.USERS]: Permission.UPDATE })
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('password') password: string,
  ): Promise<Boolean> {
    this.authService.validatePassword(password);
    const passwordHash = await this.authService.hashPassword(password);
    await this.userService.update({ id }, { passwordHash });

    return true;
  }
}
