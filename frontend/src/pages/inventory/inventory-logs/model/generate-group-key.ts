import { InventoryLogsGroupPartialDto } from "../api";

export const generateGroupKey = (entity: InventoryLogsGroupPartialDto) =>
  JSON.stringify([
    entity.timestamp,
    entity.action,
    entity.attribute,
    entity.author?.id,
    entity.prevValue,
    entity.nextValue,
  ]);
