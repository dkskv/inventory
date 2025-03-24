import {
  InventoryLogsDocument,
  InventoryLogsFiltrationInput,
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

export const useFetchGroupData = () => {
  const [executeLogsQuery] = useLazyQuery(InventoryLogsDocument, {
    fetchPolicy: "network-only",
  });

  return useCallback(
    (
      activeGroup: InventoryLogsGroupPartialDto,
      paging: PagingInput,
      filtration: InventoryLogsFiltrationInput
    ): Promise<InventoryLogsData> =>
      executeLogsQuery({
        variables: {
          filtration: {
            ...filtration,
            ...createFiltrationByGroup(activeGroup),
          },
          paging,
        },
      }).then(({ data }) => data!.inventoryLogs),
    [executeLogsQuery]
  );
};
