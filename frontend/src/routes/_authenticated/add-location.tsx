import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { api } from "@/lib/api";
import { createLocationSchema } from "@server/sharedTypes";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

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
      startDate: new Date().toISOString().split("T")[0], // ISO string (YYYY-MM-DD)
      endDate: new Date().toISOString().split("T")[0], // ISO string (YYYY-MM-DD)
    },
    onSubmit: async ({ value }) => {
      const res = await api.locations.$post({ json: value });
      if (!res.ok) {
        throw new Error("Server error");
      }
      navigate({ to: "/locations" });
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
        <div className="flex flex-col gap-2">
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
