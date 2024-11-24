import { z } from "zod";

export const locationSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  visited: z.boolean().default(false),
  latitude: z.string().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .string()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  address: z.string().trim().max(256).optional(),
  favorite: z.boolean().default(false),
});

export const createLocationSchema = locationSchema.omit({ id: true });
