import { assetSchema } from "@/entities/asset";
import { locationSchema } from "@/entities/location";
import { responsibleSchema } from "@/entities/responsible";
import { z } from "zod";

export const inventoryRecordSchema = z.object({
  id: z.number(),
  asset: assetSchema,
  location: locationSchema,
  responsible: responsibleSchema,
  serialNumber: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  __typename: z.literal("InventoryRecordDto").optional(),
});
