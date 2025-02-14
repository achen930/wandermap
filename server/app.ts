import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { locationsRoute } from "./routes/locations";
import { authRoute } from "./routes/auth";
import { mapRoute } from "./routes/map";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/locations", locationsRoute)
  .route("/", authRoute)
  .route("/map", mapRoute);

app.use("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
