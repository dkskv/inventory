import {
  InventoryRecordsFiltrationInput,
  InventoryRecordsOrGroupsDocument,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export const useFetchRootData = (
  filtration: InventoryRecordsFiltrationInput
) => {
  const [executeRecordsOrGroupsQuery] = useLazyQuery(
    InventoryRecordsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );

  return useCallback(
    async (paging: PagingInput) =>
      executeRecordsOrGroupsQuery({
        variables: { paging, filtration },
      }).then(({ data }) => data!.inventoryRecordsOrGroups),
    [executeRecordsOrGroupsQuery, filtration]
  );
};
