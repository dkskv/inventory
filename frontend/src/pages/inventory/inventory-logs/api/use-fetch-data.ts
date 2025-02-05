import {
  InventoryLogsDocument,
  InventoryLogsFiltrationInput,
  InventoryLogsOrGroupsDocument,
  InventoryLogsOrGroupsQuery,
  InventoryLogsQuery,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import { createFiltrationByGroup } from "./create-filtration-by-group";
import { InventoryLogsGroupPartialDto } from "./dto";

export type InventoryLogsData =
  | InventoryLogsQuery["inventoryLogs"]
  | InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"];

export const useFetchData = () => {
  const [executeLogsOrGroupsQuery] = useLazyQuery(
    InventoryLogsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );
  const [executeLogsQuery] = useLazyQuery(InventoryLogsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    (
      activeGroup: InventoryLogsGroupPartialDto | undefined,
      paging: PagingInput,
      filtration: InventoryLogsFiltrationInput
    ): Promise<InventoryLogsData> => {
      if (activeGroup) {
        return executeLogsQuery({
          variables: {
            filtration: {
              ...filtration,
              ...createFiltrationByGroup(activeGroup),
            },
            paging,
          },
        }).then(({ data }) => data!.inventoryLogs);
      }

      return executeLogsOrGroupsQuery({
        variables: {
          filtration,
          paging,
        },
      }).then(({ data }) => data!.inventoryLogsOrGroups);
    },
    [executeLogsOrGroupsQuery, executeLogsQuery]
  );
};
