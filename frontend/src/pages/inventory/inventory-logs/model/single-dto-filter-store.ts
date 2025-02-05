import { action, observable } from "mobx";

export class SingleDtoFilterStore<Dto> {
  @observable.ref protected accessor value: Dto | undefined = undefined;

  constructor() {}

  @action.bound
  setValue(v: Dto | undefined) {
    this.value = v;
  }

  getValue() {
    return this.value;
  }
}
