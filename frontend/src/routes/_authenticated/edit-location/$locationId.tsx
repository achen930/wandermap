import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editLocation } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createLocationSchema } from "@server/sharedTypes";
import {
  getLocationByIdQueryOptions,
  loadingCreateLocationQueryOptions,
} from "@/lib/api";

export const Route = createFileRoute(
  "/_authenticated/edit-location/$locationId"
)({
  component: EditLocation,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function EditLocation() {
  const { locationId } = Route.useParams();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery(
    getLocationByIdQueryOptions(Number(locationId))
  );

  const { data: loadingCreateLocation } = useQuery(
    loadingCreateLocationQueryOptions
  );
  console.log(data);

  if (error)
    return (
      <div className="text-red-500">An error has occurred: {error.message}</div>
    );

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: loadingCreateLocation?.location?.name,
      visited: loadingCreateLocation?.location?.visited,
      latitude: loadingCreateLocation?.location?.latitude,
      longitude: loadingCreateLocation?.location?.longitude,
      address: loadingCreateLocation?.location?.address,
      startDate: loadingCreateLocation?.location?.startDate,
      endDate: loadingCreateLocation?.location?.endDate,
      favorite: loadingCreateLocation?.location?.favorite,
    },
    onSubmit: async (data) => {
      const updatedLocation = {
        id: Number(locationId),
        updates: {
          name: data.value.name,
          visited: data.value.visited,
          latitude: data.value.latitude,
          longitude: data.value.longitude,
          address: data.value.address,
          startDate: data.value.startDate,
          endDate: data.value.endDate,
          favorite: data.value.favorite,
        },
      };

      mutation.mutate(updatedLocation);
    },
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const mutation = useMutation({
    mutationFn: editLocation,
    onError: () => {
      toast("Error", {
        description: `Failed to update location: ${locationId}`,
      });
    },
    onSuccess: (updatedLocation) => {
      toast("Location Updated", {
        description: `Successfully updated location: ${locationId}`,
      });

      queryClient.setQueryData(
        ["location", locationId],
        (existingLocationData) => {
          if (existingLocationData) {
            return {
              ...existingLocationData,
              location: updatedLocation,
            };
          }
          return existingLocationData;
        }
      );
    },
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const address = place.formatted_address;
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      form.setFieldValue("address", address || "");
      form.setFieldValue("latitude", String(latitude));
      form.setFieldValue("longitude", String(longitude));
    }
  };

  return (
    <div>
      <h1>Edit Location</h1>
      <p>Make changes to your location here. Click save when you're done.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full flex flex-col mt-4 gap-y-4"
      >
        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: createLocationSchema.shape.name,
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Name</Label>
              <input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border rounded px-2"
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        {/* Address Field */}
        <form.Field
          name="address"
          validators={{
            onChange: createLocationSchema.shape.address,
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor={field.name}>Address</Label>
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border rounded px-2"
                />
              </Autocomplete>

              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="startDate"
          validators={{
            onChange: createLocationSchema.shape.startDate,
          }}
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                Start Date
              </Label>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
          )}
        />
        <form.Field
          name="endDate"
          validators={{
            onChange: createLocationSchema.shape.endDate,
          }}
          children={(field) => (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
          )}
        />

        {/* Visited Field (Checkbox) */}
        <form.Field
          name="visited"
          validators={{
            onChange: createLocationSchema.shape.visited,
          }}
          children={(field) => (
            <div className="flex items-center gap-2">
              <Label htmlFor="visited">Visited</Label>
              <input
                type="checkbox"
                id="visited"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="rounded"
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        {/* Favorite Field (Checkbox) */}
        <form.Field
          name="favorite"
          validators={{
            onChange: createLocationSchema.shape.favorite,
          }}
          children={(field) => (
            <div className="flex items-center gap-2">
              <Label htmlFor="favorite">Favorite</Label>
              <input
                type="checkbox"
                id="favorite"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="rounded"
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Editing Location..." : "Edit Location"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
