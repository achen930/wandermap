import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  createLocation,
  getAllLocationsQueryOptions,
  loadingCreateLocationQueryOptions,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { createLocationSchema } from "@server/sharedTypes";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/add-location")({
  component: AddLocation,
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

function AddLocation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: "",
      visited: false,
      favorite: false,
      address: "",
      latitude: "",
      longitude: "",
      startDate: new Date(Date.now()).toISOString().split("T")[0],
      endDate: new Date(Date.now()).toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      const existingLocations = await queryClient.ensureQueryData(
        getAllLocationsQueryOptions
      );

      navigate({ to: "/locations" });

      // loading state
      queryClient.setQueryData(loadingCreateLocationQueryOptions.queryKey, {
        location: value,
      });

      try {
        const newLocation = await createLocation({ value });

        queryClient.setQueryData(getAllLocationsQueryOptions.queryKey, {
          ...existingLocations,
          locations: [newLocation, ...existingLocations.locations],
        });
        toast("Location Created", {
          description: `Successfully created new location: ${newLocation.name}`,
        });
      } catch (e) {
        // error state
        toast("Error", {
          description: "Failed to create new location",
        });
      } finally {
        queryClient.setQueryData(
          loadingCreateLocationQueryOptions.queryKey,
          {}
        );
      }
    },
  });

  return (
    <div className="p-2">
      <h2>Add Location</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col max-w-xl m-auto mt-4 gap-y-4"
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
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border rounded px-2"
              />
              <FieldInfo field={field} />
            </div>
          )}
        />

        {/* Date Picker */}
        <div className="flex flex-col gap-2 self-center">
          <Label>Date Range</Label>
          <DatePickerWithRange
            startDate={new Date(form.state.values.startDate)}
            endDate={new Date(form.state.values.endDate)}
            onDateChange={(startDate, endDate) => {
              form.setFieldValue(
                "startDate",
                startDate.toISOString().split("T")[0]
              );
              form.setFieldValue(
                "endDate",
                endDate.toISOString().split("T")[0]
              );
            }}
          />
        </div>

        {/* Visited Field (Checkbox) */}
        <form.Field
          name="visited"
          validators={{
            onChange: createLocationSchema.shape.visited,
          }}
          children={(field) => (
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
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

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Adding Location..." : "Add Location"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
