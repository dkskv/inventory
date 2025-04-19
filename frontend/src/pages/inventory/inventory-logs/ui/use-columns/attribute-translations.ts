import { InventoryAttribute } from "@/gql/graphql";

export const attributeTranslations: Record<
  InventoryAttribute,
  string | undefined
> = {
  assetId: undefined,
  responsibleId: "responsible",
  locationId: "location",
  serialNumber: "serialNumber",
  description: "description",
  statusId: "status",
} as const;
