import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUser } from "../kinde";

const locationSchema = z.object({
	id: z.number().int().positive().min(1),
	name: z.string().min(3).max(100),
	visited: z.boolean(),
});

type Location = z.infer<typeof locationSchema>;

const createPostSchema = locationSchema.omit({ id: true });

const fakeLocations: Location[] = [
	{ id: 1, name: "Vancouver", visited: true },
	{ id: 2, name: "Whistler", visited: true },
];

export const locationsRoute = new Hono()
	.get("/", getUser, async (c) => {
		const user = c.var.user;
		// await new Promise((r) => setTimeout(r, 2000));
		c.status(200);
		return c.json({ locations: fakeLocations });
	})
	.post("/", getUser, zValidator("json", createPostSchema), async (c) => {
		const location = await c.req.valid("json");
		const newLocation = { ...location, id: fakeLocations.length + 1 };
		fakeLocations.push(newLocation);
		c.status(201);
		return c.json(newLocation);
	})
	.get("/total-locations", getUser, async (c) => {
		// await new Promise((r) => setTimeout(r, 2000));
		const total = fakeLocations.length;
		c.status(200);
		return c.json({ total });
	})
	.get("/:id{[0-9]+}", getUser, (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const location = fakeLocations.find((location) => location.id === id);
		if (!location) {
			return c.notFound();
		}
		c.status(200);
		return c.json({ location });
	})
	.delete("/:id{[0-9]+}", getUser, (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const index = fakeLocations.findIndex((location) => location.id === id);
		if (index === -1) {
			return c.notFound();
		}
		const deletedLocation = fakeLocations.splice(index, 1)[0];
		// set status for deleting and don't show deleted item
		// c.status(204);
		// return c.body(null)
		return c.json({
			message: "Location deleted",
			location: deletedLocation,
		});
	});
