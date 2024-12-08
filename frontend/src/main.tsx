import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useLoadScript } from "@react-google-maps/api";
import { api } from "./lib/api";
import { GoogleMapsProvider } from "./GoogleMapsContext";

// Create a client
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function getApiKey() {
  const res = await api.map.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const { googleMapsApiKey } = await res.json();
  return googleMapsApiKey;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleMapsProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleMapsProvider>
  </StrictMode>
);
