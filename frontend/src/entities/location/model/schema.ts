import { z } from "zod";

export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  __typename: z.literal("LocationDto").optional(),
});
