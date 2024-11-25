import { insertLocationSchema } from "./db/schema/locations";
import { z } from "zod";

export const createLocationSchema = insertLocationSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export type CreateLocation = z.infer<typeof createLocationSchema>;
