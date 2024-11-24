import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { api } from "@/lib/api";
import { createLocationSchema } from "@server/sharedTypes";

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
    },
    onSubmit: async ({ value }) => {
      const res = await api.locations.$post({ json: value });
      if (!res.ok) {
        throw new Error("server error");
      }
      navigate({ to: "/locations" });
    },
  });

  return (
    <div className="p-2">
      <h2>Add location</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col max-w-xl m-auto mt-4 gap-4"
      >
        {/* Name Field */}
        <div className="flex items-center gap-2">
          <form.Field
            name="name"
            validators={{
              onChange: createLocationSchema.shape.name,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Name</Label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="text"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border b-2 rounded px-2"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        {/* Address Field */}
        <div className="flex items-center gap-2">
          <form.Field
            name="address"
            validators={{
              onChange: createLocationSchema.shape.address,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Address</Label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="text"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border b-2 rounded px-2"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>

        {/* Visited Field */}
        <form.Field
          name="visited"
          validators={{
            onChange: createLocationSchema.shape.visited,
          }}
          children={(field) => (
            <>
              <Label htmlFor="visited">Visited</Label>
              <RadioGroup
                value={`${field.state.value}`}
                onValueChange={(value) => field.handleChange(value === "true")}
                className="flex flex-row"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
              <FieldInfo field={field} />
            </>
          )}
        />

        {/* Favorite Field */}
        <form.Field
          name="favorite"
          validators={{
            onChange: createLocationSchema.shape.favorite,
          }}
          children={(field) => (
            <>
              <Label htmlFor="favorite">Favorite</Label>
              <RadioGroup
                value={`${field.state.value}`}
                onValueChange={(value) => field.handleChange(value === "true")}
                className="flex flex-row"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="favorite-yes" />
                  <Label htmlFor="favorite-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="favorite-no" />
                  <Label htmlFor="favorite-no">No</Label>
                </div>
              </RadioGroup>
              <FieldInfo field={field} />
            </>
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
