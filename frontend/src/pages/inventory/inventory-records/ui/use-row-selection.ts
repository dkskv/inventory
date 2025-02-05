import { InventoryRecordOrGroupDto } from "@/gql/graphql";
import { useState } from "react";
import { isGroup } from "../api";
import { isNumberArray } from "../lib";
import { Key } from "antd/es/table/interface";

export const useRowSelection = () => {
  const [selectedIds, setSelectedIds] = useState<number[] | undefined>();

  const rowSelection = (() => {
    if (selectedIds === undefined) {
      return undefined;
    }

    return {
      preserveSelectedRowKeys: true,
      getCheckboxProps({ entity }: { entity: InventoryRecordOrGroupDto }) {
        return { disabled: isGroup(entity) };
      },
      onChange(keys: Key[]) {
        if (isNumberArray(keys)) {
          setSelectedIds(keys);
        }
      },
      selectedRowKeys: selectedIds,
    };
  })();

  return { selectedIds, setSelectedIds, rowSelection } as const;
};
