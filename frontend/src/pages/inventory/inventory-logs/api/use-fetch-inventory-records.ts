import {
  InventoryRecordByIdDocument,
  InventoryRecordsDocument,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import isInteger from "lodash/isInteger";
import { useCallback } from "react";
import { InventoryRecordPartialDto } from "./dto";

export const useFetchInventoryRecords = () => {
  const [executeInventoryRecordByIdQuery] = useLazyQuery(
    InventoryRecordByIdDocument,
    { fetchPolicy: "network-only" }
  );
  const [executeInventoryRecordsQuery] = useLazyQuery(
    InventoryRecordsDocument,
    { fetchPolicy: "network-only" }
  );

  return useCallback(
    (searchIdText: string): Promise<InventoryRecordPartialDto[]> => {
      const id = searchIdText ? Number(searchIdText) : undefined;

      return id !== undefined && isInteger(id)
        ? executeInventoryRecordByIdQuery({
            variables: { id },
          }).then(({ data }) =>
            data?.inventoryRecordById ? [data.inventoryRecordById] : []
          )
        : executeInventoryRecordsQuery({
            variables: { paging: { limit: 10, offset: 0 } },
          }).then(({ data }) => data!.inventoryRecords.items);
    },
    [executeInventoryRecordByIdQuery, executeInventoryRecordsQuery]
  );
};
