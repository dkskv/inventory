import { InventoryLogsGroupPartialDto, InventoryLogPartialDto } from "../api";

export const isGroup = (
  entity: InventoryLogPartialDto | InventoryLogsGroupPartialDto
): entity is InventoryLogsGroupPartialDto => {
  return entity.__typename === "InventoryLogsGroupDto";
};
