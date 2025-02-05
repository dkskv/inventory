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
} from "@/gql/graphql";
import { CatalogEntityFilterStore } from "./catalog-entity-filter-store";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { hasOnlyUndefined, PersistStorage } from "@/shared/lib";
import { assetSchema } from "@/entities/asset";
import { locationSchema } from "@/entities/location";
import { responsibleSchema } from "@/entities/responsible";

interface PersistValue {
  assets?: AssetDto[];
  locations?: LocationDto[];
  responsibles?: ResponsibleDto[];
  serialNumberSearchText?: string;
  descriptionSearchText?: string;
}

export class FiltersStore {
  assets = new CatalogEntityFilterStore<AssetDto>();
  locations = new CatalogEntityFilterStore<LocationDto>();
  responsibles = new CatalogEntityFilterStore<ResponsibleDto>();
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
        assets: z.array(assetSchema).optional(),
        locations: z.array(locationSchema).optional(),
        responsibles: z.array(responsibleSchema).optional(),
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
