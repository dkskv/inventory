import {
  InventoryLogsFiltrationInput,
  InventoryLogsOrGroupsDocument,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export const useFetchRootData = (filtration: InventoryLogsFiltrationInput) => {
  const [executeLogsOrGroupsQuery] = useLazyQuery(
    InventoryLogsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );

  return useCallback(
    (paging: PagingInput) =>
      executeLogsOrGroupsQuery({
        variables: {
          filtration,
          paging,
        },
      }).then(({ data }) => data!.inventoryLogsOrGroups),
    [executeLogsOrGroupsQuery, filtration]
  );
};
