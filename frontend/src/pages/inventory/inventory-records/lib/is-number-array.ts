import isNumber from "lodash/isNumber";

export const isNumberArray = (arr: unknown[]): arr is number[] =>
  arr.every(isNumber);
