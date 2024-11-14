import { Hono } from "hono";

export const destinationsRoute = new Hono()
	.get("/", (c) => {
		return c.json({ destinations: [] });
	})
	.post("/", (c) => {
		return c.json({});
	});
