import {
  InventoryLogsFiltrationInput,
  InventoryRecordDto,
} from "@/gql/graphql";
import { action, comparer, computed, IReactionDisposer } from "mobx";
import { useLocation } from "react-router";
import { useEffect, useMemo } from "react";
import { hasOnlyUndefined, PersistStorage } from "@/shared/lib";
import { z } from "zod";
import { SingleDtoFilterStore } from "./single-dto-filter-store";
import { InventoryRecordPartialDto } from "../api";

interface PersistValue {
  inventoryRecord?: InventoryRecordPartialDto;
}

export class FiltersStore {
  public inventoryRecordFilterStore =
    new SingleDtoFilterStore<InventoryRecordPartialDto>();

  private persist: PersistStorage<PersistValue>;

  private inventoryRecordSchema = z.object({
    id: z.number(),
    asset: z.object({
      id: z.number(),
      name: z.string(),
      __typename: z.literal("AssetDto").optional(),
    }),
    location: z.object({
      id: z.number(),
      name: z.string(),
      __typename: z.literal("LocationDto").optional(),
    }),
    responsible: z.object({
      id: z.number(),
      name: z.string(),
      __typename: z.literal("ResponsibleDto").optional(),
    }),
    __typename: z.literal("InventoryRecordDto").optional(),
  });

  constructor(persistKey: string) {
    this.persist = new PersistStorage(persistKey);
  }

  @computed({ equals: comparer.structural })
  get serverValue(): InventoryLogsFiltrationInput {
    const inventoryRecord = this.inventoryRecordFilterStore.getValue();

    return {
      inventoryRecordIds:
        inventoryRecord === undefined ? undefined : [inventoryRecord.id],
    };
  }

  @action.bound
  restoreFromHistoryState(stateUnvalidated: {
    inventoryRecord: InventoryRecordDto;
  }) {
    const parseResult = this.inventoryRecordSchema.safeParse(
      stateUnvalidated.inventoryRecord
    );

    if (!parseResult.success) {
      return;
    }

    const inventoryRecord = parseResult.data;

    if (inventoryRecord) {
      this.inventoryRecordFilterStore.setValue(inventoryRecord);
    }
  }

  @computed
  private get persistValue(): PersistValue {
    return {
      inventoryRecord: this.inventoryRecordFilterStore.getValue(),
    };
  }

  runAutoSaveToPersist(): IReactionDisposer {
    return this.persist.runAutoSave(() => this.persistValue, hasOnlyUndefined);
  }

  @action.bound
  restoreFromPersist() {
    const persistValue = this.persist.restore(
      z.object({
        inventoryRecord: this.inventoryRecordSchema.optional(),
      })
    );

    if (!persistValue) {
      return;
    }

    if (persistValue.inventoryRecord)
      this.inventoryRecordFilterStore.setValue(persistValue.inventoryRecord);
  }
}

export const useFiltersStore = () => {
  const location = useLocation();

  const filtersStore = useMemo(
    () => {
      const s = new FiltersStore("inventory-logs-filters");

      s.restoreFromPersist();

      if (location.state?.inventoryRecord) {
        s.restoreFromHistoryState({
          inventoryRecord: location.state.inventoryRecord,
        });
      }

      return s;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => filtersStore.runAutoSaveToPersist(), [filtersStore]);

  return filtersStore;
};
