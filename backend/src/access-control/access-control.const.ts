export enum AccessRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Privilege {
  INVENTORY = 'INVENTORY',
  USERS = 'USERS',
}

export enum Permission {
  CREATE = 1 << 0, // 0b0001 = 1
  READ = 1 << 1, // 0b0010 = 2
  UPDATE = 1 << 2, // 0b0100 = 4
  DELETE = 1 << 3, // 0b1000 = 8
}

const ALL_PERMISSIONS =
  Permission.CREATE | Permission.READ | Permission.UPDATE | Permission.DELETE;

export interface PermissionsByPrivilege extends Record<Privilege, number> {}

/** Статичная схема ролей доступа */
export const accessScheme: Record<AccessRole, PermissionsByPrivilege> = {
  [AccessRole.ADMIN]: {
    [Privilege.INVENTORY]: ALL_PERMISSIONS,
    [Privilege.USERS]: ALL_PERMISSIONS,
  },
  [AccessRole.USER]: {
    [Privilege.INVENTORY]:
      Permission.CREATE | Permission.READ | Permission.UPDATE,
    [Privilege.USERS]: 0,
  },
};
