import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const destinationSchema = z.object({
	id: z.number().int().positive().min(1),
	name: z.string().min(3).max(100),
	visited: z.boolean(),
});

type Destination = z.infer<typeof destinationSchema>;

const createPostSchema = destinationSchema.omit({ id: true });

const fakeDestinations: Destination[] = [
	{ id: 1, name: "Vancouver", visited: true },
	{ id: 2, name: "Whistler", visited: true },
];

export const destinationsRoute = new Hono()
	.get("/", (c) => {
		return c.json({ destinations: fakeDestinations });
	})
	.post("/", zValidator("json", createPostSchema), async (c) => {
		const destination = await c.req.valid("json");
		fakeDestinations.push({ ...destination, id: fakeDestinations.length + 1 });
		c.status(201);
		return c.json(destination);
	})
	.get("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const destination = fakeDestinations.find(
			(destination) => destination.id === id
		);
		if (!destination) {
			return c.notFound();
		}
		return c.json({ destination });
	})
	.delete("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const destination = fakeDestinations.find(
			(destination) => destination.id === id
		);
		if (!destination) {
			return c.notFound();
		}
		return c.json({ destination });
	});
