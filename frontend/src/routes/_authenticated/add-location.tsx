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
import { useEffect, useRef } from "react";
import { useGoogleMapsApiKey } from "@/GoogleMapsContext";

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
    const googleMapsApiKey = useGoogleMapsApiKey();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
        null
    );

    if (!googleMapsApiKey) return null;

    useEffect(() => {
        if (window.google && inputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(
                inputRef.current
            );
            autocompleteRef.current.addListener(
                "place_changed",
                handlePlaceSelect
            );
        }
    });

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
            queryClient.setQueryData(
                loadingCreateLocationQueryOptions.queryKey,
                {
                    location: value,
                }
            );

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
        <div className="p-2 flex flex-col w-full items-center">
            <h2 className="font-bold text-2xl">Add Location</h2>
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
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                className="border rounded px-2"
                                placeholder="Location Name"
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
                                value={form.state.values.address}
                                onChange={(e) =>
                                    form.setFieldValue(
                                        "address",
                                        e.target.value
                                    )
                                }
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
                        className="w-full"
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
                        <div className="flex items-center gap-2">
                            <Label htmlFor="visited">Visited</Label>
                            <input
                                type="checkbox"
                                id="visited"
                                checked={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.checked)
                                }
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
                                onChange={(e) =>
                                    field.handleChange(e.target.checked)
                                }
                                className="rounded"
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />

                {/* <div className="flex flex-col items-start gap-4">
          <Label htmlFor="photo">Photo</Label>
          <input
            type="file"
            id="photo"
            className="hidden"
            onChange={(e) => console.log(e.target.files)}
          />
          <label
            htmlFor="photo"
            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <span className="text-sm text-gray-600">Upload Photo</span>
          </label>
        </div> */}

                {/* Submit Button */}
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="rounded-full"
                        >
                            {isSubmitting
                                ? "Adding Location..."
                                : "Add Location"}
                        </Button>
                    )}
                />
            </form>
        </div>
    );
}
