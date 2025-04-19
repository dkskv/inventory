import mapValues from "lodash/mapValues";

export const convertEntitiesArraysToMaps = <
  T extends Record<string, Array<{ id: number }>>
>(
  obj: T
): { [K in keyof T]: Map<number, T[K][number]> } =>
  mapValues(obj, (arr) => new Map(arr.map((item) => [item.id, item])));
