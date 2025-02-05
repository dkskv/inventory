import { InventoryRecordsGroupDto } from "@/gql/graphql";

export const generateGroupKey = (entity: InventoryRecordsGroupDto) =>
  JSON.stringify([entity.asset.id, entity.location.id, entity.responsible.id]);
