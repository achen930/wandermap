import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import {
  locations as locationsTable,
  insertLocationSchema,
} from "../db/schema/locations";
import { eq, desc, count, and } from "drizzle-orm";
import { createLocationSchema } from "../sharedTypes";

export const locationsRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const locations = await db
      .select()
      .from(locationsTable)
      .where(eq(locationsTable.userId, user.id))
      .orderBy(desc(locationsTable.createdAt))
      .limit(100);

    c.status(200);
    return c.json({ locations: locations });
  })
  .post("/", getUser, zValidator("json", createLocationSchema), async (c) => {
    const location = await c.req.valid("json");
    const user = c.var.user;

    if (!location) {
      return c.json({ error: "Invalid location data" }, 400);
    }

    const validatedLocation = insertLocationSchema.parse({
      ...location,
      userId: user.id,
    });

    const result = await db
      .insert(locationsTable)
      .values(validatedLocation)
      .returning()
      .then((res) => res[0]);

    if (!result) {
      return c.json({ error: "Failed to create location" }, 500);
    }

    c.status(201);
    return c.json(result);
  })
  .get("/total-locations", getUser, async (c) => {
    const user = c.var.user;

    const result = await db
      .select({ total: count() })
      .from(locationsTable)
      .where(eq(locationsTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    c.status(200);
    return c.json({ total: result.total });
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const location = await db
      .select()
      .from(locationsTable)
      .where(and(eq(locationsTable.userId, user.id), eq(locationsTable.id, id)))
      .orderBy(desc(locationsTable.createdAt))
      .then((res) => res[0]);
    if (!location) {
      return c.notFound();
    }
    c.status(200);
    return c.json({ location });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const location = await db
      .delete(locationsTable)
      .where(and(eq(locationsTable.userId, user.id), eq(locationsTable.id, id)))
      .returning()
      .then((res) => res[0]);
    if (!location) {
      return c.notFound();
    }

    // set status for deleting and don't show deleted item
    // c.status(204);
    // return c.body(null)
    return c.json({ location: location });
  })
  .patch(
    "/:id{[0-9]+}",
    getUser,
    zValidator("json", createLocationSchema),
    async (c) => {
      const id = Number.parseInt(c.req.param("id"));
      const updates = await c.req.valid("json");
      const user = c.var.user;

      // Ensure the location exists and belongs to the user
      const existingLocation = await db
        .select()
        .from(locationsTable)
        .where(
          and(eq(locationsTable.userId, user.id), eq(locationsTable.id, id))
        )
        .then((res) => res[0]);

      if (!existingLocation) {
        return c.json({ error: "Location not found or unauthorized" }, 404);
      }

      // Update the location
      const updatedLocation = await db
        .update(locationsTable)
        .set(updates)
        .where(
          and(eq(locationsTable.userId, user.id), eq(locationsTable.id, id))
        )
        .returning()
        .then((res) => res[0]);

      if (!updatedLocation) {
        return c.json({ error: "Failed to update location" }, 500);
      }

      c.status(200);
      return c.json({ location: updatedLocation });
    }
  );
