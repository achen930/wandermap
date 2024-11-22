import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUser } from "../kinde";
import { db } from "../db";
import { locations as locationsTable } from "../db/schema/locations";
import { eq, desc, count, and } from "drizzle-orm";

const locationSchema = z.object({
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

type Location = z.infer<typeof locationSchema>;

const createPostSchema = locationSchema.omit({ id: true });

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
	.post("/", getUser, zValidator("json", createPostSchema), async (c) => {
		const location = await c.req.valid("json");
		const user = c.var.user;

		if (!location) {
			return c.json({ error: "Invalid location data" }, 400);
		}

		const result = await db
			.insert(locationsTable)
			.values({
				...location,
				userId: user.id,
			})
			.returning();

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
	});
