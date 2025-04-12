import sortBy from "lodash/sortBy";
import isEqualWith from "lodash/isEqualWith";

const isSameEntity = <Dto extends { id: number }>(a: Dto, b: Dto) =>
  a.id === b.id;

export const areSameEntities = <Dto extends { id: number }>(
  a: Dto[],
  b: Dto[]
) => {
  if (a.length !== b.length) return false;

  const sortById = (arr: Dto[]) => sortBy(arr, "id");

  return isEqualWith(sortById(a), sortById(b), isSameEntity);
};
