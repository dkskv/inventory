import { InventoryLogsFiltrationInput } from "@/gql/graphql";
import { InventoryLogsGroupPartialDto } from "./dto";

export const createFiltrationByGroup = (
  entity: InventoryLogsGroupPartialDto
): InventoryLogsFiltrationInput => ({
  timestamp: entity.timestamp,
  action: entity.action,
  attribute: entity.attribute,
  prevValue: entity.prevValue,
  nextValue: entity.nextValue,
});
