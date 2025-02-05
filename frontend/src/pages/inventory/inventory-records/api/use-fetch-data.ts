import {
  InventoryRecordsDocument,
  InventoryRecordsFiltrationInput,
  InventoryRecordsGroupDto,
  InventoryRecordsOrGroupsDocument,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import { createFiltrationByGroup } from "./create-filtration-by-group";

export const useFetchData = (
  activeGroup: InventoryRecordsGroupDto | undefined,
  filtration: InventoryRecordsFiltrationInput
) => {
  const [executeRecordsOrGroupsQuery] = useLazyQuery(
    InventoryRecordsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );
  const [executeRecordsQuery] = useLazyQuery(InventoryRecordsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    (paging: PagingInput) => {
      if (activeGroup) {
        return executeRecordsQuery({
          variables: {
            filtration: {
              ...filtration,
              ...createFiltrationByGroup(activeGroup),
            },
            paging,
          },
        }).then(({ data }) => data!.inventoryRecords);
      }

      return executeRecordsOrGroupsQuery({
        variables: { paging, filtration },
      }).then(({ data }) => data!.inventoryRecordsOrGroups);
    },
    [activeGroup, executeRecordsQuery, executeRecordsOrGroupsQuery, filtration]
  );
};
