import { InventoryLogsOrGroupsQuery, InventoryLogsQuery } from "@/gql/graphql";

export type InventoryLogPartialDto =
  InventoryLogsQuery["inventoryLogs"]["items"][0];

export type InventoryLogsGroupPartialDto = Extract<
  InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"]["items"][0],
  { count: number }
>;
