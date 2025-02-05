import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isNil } from 'lodash';
import { extractUserIdFromContext } from 'src/shared/resolver/extract-user-id-from-context';
import {
  Privilege,
  PermissionsByPrivilege,
  accessScheme,
} from './access-control.const';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

const REQUIRED_PERMISSIONS_KEY = 'requiredPermissions';

export const RequirePermissions = (a: Partial<PermissionsByPrivilege>) =>
  SetMetadata(REQUIRED_PERMISSIONS_KEY, a);

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<
      Partial<PermissionsByPrivilege>
    >(REQUIRED_PERMISSIONS_KEY, context.getHandler());

    if (isNil(requiredPermissions)) {
      return true;
    }

    const userId = extractUserIdFromContext(context);
    const user = await this.userRepository.findOneByOrFail({ id: userId });

    const userPermissionsByPrivilege = accessScheme[user.accessRole];

    return Object.entries(requiredPermissions).every(
      ([privilege, requiredPermissions]: [Privilege, number]) =>
        (userPermissionsByPrivilege[privilege] & requiredPermissions) ===
        requiredPermissions,
    );
  }
}
