import { z } from "zod";

export const assetSchema = z.object({
  id: z.number(),
  name: z.string(),
  __typename: z.literal("AssetDto").optional(),
});
