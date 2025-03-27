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
  filtration: InventoryRecordsFiltrationInput,
  onFetch: (activeGroup: InventoryRecordsGroupDto | undefined) => void
) => {
  const [executeRecordsOrGroupsQuery] = useLazyQuery(
    InventoryRecordsOrGroupsDocument,
    { fetchPolicy: "network-only" }
  );
  const [executeRecordsQuery] = useLazyQuery(InventoryRecordsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    async (paging: PagingInput) => {
      const data = await (activeGroup
        ? executeRecordsQuery({
            variables: {
              filtration: {
                ...filtration,
                ...createFiltrationByGroup(activeGroup),
              },
              paging,
            },
          }).then(({ data }) => data!.inventoryRecords)
        : executeRecordsOrGroupsQuery({
            variables: { paging, filtration },
          }).then(({ data }) => data!.inventoryRecordsOrGroups));

      onFetch(activeGroup);

      return data;
    },
    [
      activeGroup,
      executeRecordsQuery,
      executeRecordsOrGroupsQuery,
      filtration,
      onFetch,
    ]
  );
};
