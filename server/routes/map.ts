import { Hono } from "hono";
import { type Libraries } from "@react-google-maps/api";

export const mapRoute = new Hono().get("/", async (c) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return c.json({ error: "API key not found" }, 404);
  }

  c.status(200);
  return c.json({ googleMapsApiKey: apiKey });
});

export const googleMapsLibraries: Libraries = ["places"];
