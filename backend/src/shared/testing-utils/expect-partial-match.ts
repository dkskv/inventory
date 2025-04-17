import { isObject } from 'lodash';

type DeepPartialMatch<T> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepPartialMatch<U>>
    : { [K in keyof T]?: DeepPartialMatch<T[K]> }
  : T;

export function expectPartialMatch<T>(
  expected: DeepPartialMatch<T>,
  actual: T,
): void {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      throw new Error(
        `Array length mismatch. Expected ${expected.length}, got ${actual.length}`,
      );
    }

    for (let i = 0; i < expected.length; i++) {
      expectPartialMatch(expected[i], actual[i]);
    }

    return;
  }

  if (isObject(expected) && isObject(actual)) {
    for (const key in expected) {
      expectPartialMatch(expected[key], (actual as any)[key]);
    }

    return;
  }

  if (actual !== expected) {
    throw new Error(
      `Value mismatch. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}
