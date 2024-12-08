import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editLocation } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createLocationSchema } from "@server/sharedTypes";
import { getLocationByIdQueryOptions } from "@/lib/api";

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
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (window.google && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current
      );
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  });

  const { isPending, error, data, refetch } = useQuery(
    getLocationByIdQueryOptions(Number(locationId))
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error)
    return (
      <div className="text-red-500">An error has occurred: {error.message}</div>
    );

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: data?.location.name,
      visited: data?.location.visited,
      latitude: data?.location?.latitude,
      longitude: data?.location?.longitude,
      address: data?.location?.address,
      startDate: data?.location?.startDate,
      endDate: data?.location?.endDate,
      favorite: data?.location?.favorite,
    },
    onSubmit: async (data) => {
      const updatedLocation: any = {
        id: Number(locationId),
        updates: {},
      };

      if (data.value.name !== undefined)
        updatedLocation.updates.name = data.value.name;
      if (data.value.visited !== undefined)
        updatedLocation.updates.visited = data.value.visited;
      if (data.value.latitude !== undefined)
        updatedLocation.updates.latitude = data.value.latitude;
      if (data.value.longitude !== undefined)
        updatedLocation.updates.longitude = data.value.longitude;
      if (data.value.address !== undefined)
        updatedLocation.updates.address = data.value.address;
      if (data.value.startDate !== undefined)
        updatedLocation.updates.startDate = data.value.startDate;
      if (data.value.endDate !== undefined)
        updatedLocation.updates.endDate = data.value.endDate;
      if (data.value.favorite !== undefined)
        updatedLocation.updates.favorite = data.value.favorite;

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

      navigate({ to: "/locations" });
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
      {isPending ? (
        <Skeleton className="w-full h-64" />
      ) : (
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
                <input
                  ref={inputRef}
                  id="address"
                  value={String(form.state.values.address)}
                  onChange={(e) =>
                    form.setFieldValue("address", e.target.value)
                  }
                  className="border rounded px-2"
                />

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
      )}
    </div>
  );
}
