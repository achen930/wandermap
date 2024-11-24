import { insertLocationSchema } from "./db/schema/locations";

export const locationSchema = insertLocationSchema.omit({
  userId: true,
  createdAt: true,
});

export const createLocationSchema = locationSchema.omit({ id: true });
