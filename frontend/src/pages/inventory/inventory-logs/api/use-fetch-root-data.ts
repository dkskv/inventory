import {
  InventoryLogsFiltrationInput,
  InventoryLogsOrGroupsDocument,
  InventoryLogsOrGroupsQuery,
  InventoryLogsQuery,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export type InventoryLogsData =
  | InventoryLogsQuery["inventoryLogs"]
  | InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"];

export const useFetchRootData = () => {
  const [executeLogsOrGroupsQuery] = useLazyQuery(
    InventoryLogsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );

  return useCallback(
    (
      paging: PagingInput,
      filtration: InventoryLogsFiltrationInput
    ): Promise<InventoryLogsData> =>
      executeLogsOrGroupsQuery({
        variables: {
          filtration,
          paging,
        },
      }).then(({ data }) => data!.inventoryLogsOrGroups),
    [executeLogsOrGroupsQuery]
  );
};
