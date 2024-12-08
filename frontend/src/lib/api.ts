import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { createLocationSchema, type CreateLocation } from "@server/sharedTypes";
import { z } from "zod";

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

export async function getLocationById(id: number) {
  const res = await api.locations[":id{[0-9]+}"].$get({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch location data");
  }

  const data = await res.json();
  return data;
}

export const getLocationByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["get-location", id],
    queryFn: () => getLocationById(id),
    staleTime: 1000 * 60 * 5,
  });

export async function createLocation({ value }: { value: CreateLocation }) {
  //await new Promise((r) => setTimeout(r, 2000));
  const res = await api.locations.$post({ json: value });
  if (!res.ok) {
    const errorDetails = await res.json();
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

export async function editLocation({
  id,
  updates,
}: {
  id: number;
  updates: z.infer<typeof createLocationSchema>;
}) {
  const validatedUpdates = createLocationSchema.parse(updates);

  const res = await api.locations[":id{[0-9]+}"].$patch({
    param: { id: id.toString() },
    json: validatedUpdates,
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}
