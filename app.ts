import { Hono } from "hono";
import { logger } from "hono/logger";
import { destinationsRoute } from "./routes/destinations";

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => c.text("hello"));

app.get("/test", (c) => {
	return c.json({ message: "test" });
});

app.route("/api/destinations", destinationsRoute);

export default app;
