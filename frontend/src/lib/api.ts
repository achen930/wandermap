import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateLocation } from "@server/sharedTypes";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function getAllLocations() {
  // await new Promise((r) => setTimeout(r, 2000));
  const res = await api.locations.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

export const getAllLocationsQueryOptions = queryOptions({
  queryKey: ["get-all-locations"],
  queryFn: getAllLocations,
  staleTime: 1000 * 60 * 5,
});

export async function createLocation({ value }: { value: CreateLocation }) {
  //await new Promise((r) => setTimeout(r, 2000));
  const res = await api.locations.$post({ json: value });
  if (!res.ok) {
    const errorDetails = await res.text(); // Or use `res.json()` if it's a JSON response
    console.error("Error:", errorDetails);
    throw new Error("Server error");
  }

  const newLocation = await res.json();
  return newLocation;
}

export const loadingCreateLocationQueryOptions = queryOptions<{
  location?: CreateLocation;
}>({
  queryKey: ["loading-create-location"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export async function deleteLocation({ id }: { id: number }) {
  const res = await api.locations[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}
