import {
  InventoryRecordsDocument,
  InventoryRecordsFiltrationInput,
  InventoryRecordsGroupDto,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import { createFiltrationByGroup } from "./create-filtration-by-group";

export const useFetchGroupData = (
  activeGroup: InventoryRecordsGroupDto | undefined,
  filtration: InventoryRecordsFiltrationInput
) => {
  const [executeRecordsQuery] = useLazyQuery(InventoryRecordsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    async (paging: PagingInput) => {
      if (!activeGroup) {
        throw new Error("missing group");
      }

      return executeRecordsQuery({
        variables: {
          filtration: {
            ...filtration,
            ...createFiltrationByGroup(activeGroup),
          },
          paging,
        },
      }).then(({ data }) => data!.inventoryRecords);
    },
    [activeGroup, executeRecordsQuery, filtration]
  );
};
