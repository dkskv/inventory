import {
  InventoryLogsFiltrationInput,
  InventoryLogsOrGroupsQuery,
  InventoryLogsQuery,
  PagingInput,
} from "@/gql/graphql";
import { useCallback } from "react";
import { InventoryLogsGroupPartialDto } from "./dto";
import { useFetchRootData } from "./use-fetch-root-data";
import { useFetchGroupData } from "./use-fetch-group-data";

export type InventoryLogsData =
  | InventoryLogsQuery["inventoryLogs"]
  | InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"];

export const useFetchData = () => {
  const fetchRootData = useFetchRootData();
  const fetchGroupData = useFetchGroupData();

  return useCallback(
    (
      activeGroup: InventoryLogsGroupPartialDto | undefined,
      paging: PagingInput,
      filtration: InventoryLogsFiltrationInput
    ): Promise<InventoryLogsData> =>
      activeGroup
        ? fetchGroupData(activeGroup, paging, filtration)
        : fetchRootData(paging, filtration),
    [fetchRootData, fetchGroupData]
  );
};
