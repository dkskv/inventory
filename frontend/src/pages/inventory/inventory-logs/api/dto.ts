import {
  InventoryLogsOrGroupsQuery,
  InventoryLogsQuery,
  InventoryRecordDto,
} from "@/gql/graphql";

export type InventoryLogPartialDto =
  InventoryLogsQuery["inventoryLogs"]["items"][0];

export type InventoryLogsGroupPartialDto = Extract<
  InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"]["items"][0],
  { count: number }
>;

export type InventoryRecordPartialDto = Pick<
  InventoryRecordDto,
  "id" | "asset" | "location" | "responsible"
>;
