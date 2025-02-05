import { z } from "zod";

export const responsibleSchema = z.object({
  id: z.number(),
  name: z.string(),
  __typename: z.literal("ResponsibleDto").optional(),
});
