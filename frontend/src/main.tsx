import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useLoadScript } from "@react-google-maps/api";
import { api } from "./lib/api";
import { GoogleMapsProvider } from "./GoogleMapsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { googleMapsLibraries } from "@server/routes/map";

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function getApiKey() {
  const res = await api.map.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const { googleMapsApiKey } = await res.json();
  return googleMapsApiKey;
}

(async function renderApp() {
  try {
    const apiKey = await getApiKey();

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App apiKey={apiKey} />
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to load Google Maps API key:", error);
  }
})();

function App({ apiKey }: { apiKey: string }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: googleMapsLibraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMapsProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleMapsProvider>
  );
}
