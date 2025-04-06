import {
  InventoryLogsDocument,
  InventoryLogsFiltrationInput,
  PagingInput,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import { createFiltrationByGroup } from "./create-filtration-by-group";
import { InventoryLogsGroupPartialDto } from "./dto";

export const useFetchGroupData = (filtration: InventoryLogsFiltrationInput) => {
  const [executeLogsQuery] = useLazyQuery(InventoryLogsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    (activeGroup: InventoryLogsGroupPartialDto, paging: PagingInput) =>
      executeLogsQuery({
        variables: {
          filtration: {
            ...filtration,
            ...createFiltrationByGroup(activeGroup),
          },
          paging,
        },
      }).then(({ data }) => data!.inventoryLogs),
    [executeLogsQuery, filtration]
  );
};
