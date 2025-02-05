export const hasOnlyUndefined = (obj: object): boolean =>
  Object.entries(obj).every(([, value]) => value === undefined);
