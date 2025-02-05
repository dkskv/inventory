import { action, computed, observable } from "mobx";

export class CatalogEntityFilterStore<Dto extends { id: number }> {
  @observable.ref private accessor items: Dto[] = [];

  constructor() {}

  getItems() {
    return this.items;
  }

  @action.bound
  setItems(items: Dto[]) {
    this.items = items;
  }

  private rejectEmptyArray<T>(arr: T[]) {
    return arr.length === 0 ? undefined : arr;
  }

  @computed
  get serverValue() {
    return this.rejectEmptyArray(this.items.map((i) => i.id));
  }

  @computed
  get persistValue() {
    return this.rejectEmptyArray(this.items);
  }

  @action.bound
  restoreFromPersist(persistValues: Dto[]) {
    this.setItems(persistValues);
  }
}
