import {
  action,
  comparer,
  computed,
  IReactionDisposer,
  observable,
} from "mobx";
import {
  AssetDto,
  InventoryRecordsFiltrationInput,
  LocationDto,
  ResponsibleDto,
  StatusDto,
} from "@/gql/graphql";
import { CatalogEntityFilterStore } from "./catalog-entity-filter-store";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { hasOnlyUndefined, PersistStorage } from "@/shared/lib";

interface PersistValue {
  assets?: AssetDto[];
  locations?: LocationDto[];
  responsibles?: ResponsibleDto[];
  statuses?: StatusDto[];
  serialNumberSearchText?: string;
  descriptionSearchText?: string;
}

export class FiltersStore {
  assets = new CatalogEntityFilterStore<AssetDto>();
  locations = new CatalogEntityFilterStore<LocationDto>();
  responsibles = new CatalogEntityFilterStore<ResponsibleDto>();
  statuses = new CatalogEntityFilterStore<StatusDto>();
  @observable accessor serialNumberSearchText = "";
  @observable accessor descriptionSearchText = "";

  private persist: PersistStorage<PersistValue>;

  constructor(persistKey: string) {
    this.persist = new PersistStorage(persistKey);
  }

  @action.bound
  setSerialNumberSearchText(v: string) {
    this.serialNumberSearchText = v;
  }

  @action.bound
  setDescriptionSearchText(v: string) {
    this.descriptionSearchText = v;
  }

  @computed
  private get persistValue(): PersistValue {
    return {
      assets: this.assets.persistValue,
      locations: this.locations.persistValue,
      responsibles: this.responsibles.persistValue,
      statuses: this.statuses.persistValue,
      serialNumberSearchText: this.serialNumberSearchText || undefined,
      descriptionSearchText: this.descriptionSearchText || undefined,
    };
  }

  runAutoSaveToPersist(): IReactionDisposer {
    return this.persist.runAutoSave(() => this.persistValue, hasOnlyUndefined);
  }

  @action.bound
  restoreFromPersist() {
    const persistValue = this.persist.restore(
      z.object({
        assets: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              __typename: z.literal("AssetDto").optional(),
            })
          )
          .optional(),
        locations: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              __typename: z.literal("LocationDto").optional(),
            })
          )
          .optional(),
        responsibles: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              __typename: z.literal("ResponsibleDto").optional(),
            })
          )
          .optional(),
        statuses: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              color: z.string(),
              __typename: z.literal("StatusDto").optional(),
            })
          )
          .optional(),
        serialNumberSearchText: z.string().optional(),
        descriptionSearchText: z.string().optional(),
      })
    );

    if (!persistValue) {
      return;
    }

    if (persistValue.assets)
      this.assets.restoreFromPersist(persistValue.assets);
    if (persistValue.locations)
      this.locations.restoreFromPersist(persistValue.locations);
    if (persistValue.responsibles)
      this.responsibles.restoreFromPersist(persistValue.responsibles);
    if (persistValue.statuses)
      this.statuses.restoreFromPersist(persistValue.statuses);
    if (persistValue.serialNumberSearchText)
      this.setSerialNumberSearchText(persistValue.serialNumberSearchText);
    if (persistValue.descriptionSearchText)
      this.setDescriptionSearchText(persistValue.descriptionSearchText);
  }

  @computed({ equals: comparer.structural })
  get serverValue(): InventoryRecordsFiltrationInput {
    return {
      assetIds: this.assets.serverValue,
      locationIds: this.locations.serverValue,
      responsibleIds: this.responsibles.serverValue,
      statusesIds: this.statuses.serverValue,
      serialNumberSearchText: this.serialNumberSearchText,
      descriptionSearchText: this.descriptionSearchText,
    };
  }
}

export const useFiltersStore = () => {
  const filtersStore = useMemo(() => {
    const s = new FiltersStore("inventory-records-filters");
    s.restoreFromPersist();

    return s;
  }, []);

  useEffect(() => filtersStore.runAutoSaveToPersist(), [filtersStore]);

  return filtersStore;
};
