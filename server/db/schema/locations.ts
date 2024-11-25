import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  index,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    latitude: varchar("latitude", { length: 50 }).notNull(),
    longitude: varchar("longitude", { length: 50 }).notNull(),
    address: varchar("address", { length: 256 }), // Optional, fetched or user-provided
    visited: boolean("visited").notNull(),
    favorite: boolean("favorite").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
  },
  (locations) => ({
    userIdIndex: index("user_id_index").on(locations.userId),
  })
);

// Schema for inserting a location - can be used to validate API requests
export const insertLocationSchema = createInsertSchema(locations, {
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  visited: z.boolean().default(false),
  latitude: z.string().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .string()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  address: z.string().trim().max(256).optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
});

// Schema for selecting a location - can be used to validate API responses
export const selectLocationSchema = createSelectSchema(locations);
