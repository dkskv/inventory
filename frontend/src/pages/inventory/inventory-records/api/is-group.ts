import { InventoryRecordDto, InventoryRecordsGroupDto } from "@/gql/graphql";

export const isGroup = (
  entity: InventoryRecordDto | InventoryRecordsGroupDto
): entity is InventoryRecordsGroupDto => {
  return entity.__typename === "InventoryRecordsGroupDto";
};
