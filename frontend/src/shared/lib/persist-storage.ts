import { IReactionDisposer, reaction } from "mobx";
import { ZodType } from "zod";

export class PersistStorage<T> {
  constructor(private key: string) {}

  restore(scheme: ZodType<T>): T | null {
    const persistValueJson = localStorage.getItem(this.key);

    if (persistValueJson === null) {
      return null;
    }

    const parseResult = scheme.safeParse(JSON.parse(persistValueJson));

    if (!parseResult.success) {
      console.error(`error parsing "${this.key}"`, parseResult.error);
      return null;
    }

    return parseResult.data;
  }

  runAutoSave(
    selector: () => T,
    isEmpty: (v: T) => boolean
  ): IReactionDisposer {
    return reaction(selector, (persistValue) => {
      if (isEmpty(persistValue)) {
        localStorage.removeItem(this.key);
      } else {
        localStorage.setItem(this.key, JSON.stringify(persistValue));
      }
    });
  }
}
