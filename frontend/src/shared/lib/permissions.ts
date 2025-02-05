// todo: root shared - переиспользовать файл между frontend и backend

export enum Permission {
  CREATE = 1 << 0, // 0b0001 = 1
  READ = 1 << 1, // 0b0010 = 2
  UPDATE = 1 << 2, // 0b0100 = 4
  DELETE = 1 << 3, // 0b1000 = 8
}

export const ALL_PERMISSIONS =
  Permission.CREATE | Permission.READ | Permission.UPDATE | Permission.DELETE;

export const hasPermissions = (
  currentPermissions: number,
  requiredPermissions: number
) => (currentPermissions & requiredPermissions) === requiredPermissions;
