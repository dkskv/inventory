import {
  InventoryRecordsFiltrationInput,
  InventoryRecordsGroupDto,
} from "@/gql/graphql";

export const createFiltrationByGroup = (
  entity: InventoryRecordsGroupDto
): InventoryRecordsFiltrationInput => {
  return {
    assetIds: [entity.asset.id],
    locationIds: [entity.location.id],
    responsibleIds: [entity.responsible.id],
  };
};
