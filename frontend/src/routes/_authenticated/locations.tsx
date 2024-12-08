import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLocationsQueryOptions,
  loadingCreateLocationQueryOptions,
  deleteLocation,
  editLocation,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { useGoogleMapsApiKey } from "@/GoogleMapsContext";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createLocationSchema } from "@server/sharedTypes";

export const Route = createFileRoute("/_authenticated/locations")({
  component: Locations,
});

function Locations() {
  const { isPending, error, data } = useQuery(getAllLocationsQueryOptions);
  const { data: loadingCreateLocation } = useQuery(
    loadingCreateLocationQueryOptions
  );
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  if (error)
    return (
      <div className="text-red-500">An error has occurred: {error.message}</div>
    );

  const handleEdit = (id: number) => {
    const locationToEdit = data?.locations.find(
      (location) => location.id === id
    );
    console.log("location data: ", data);
    if (locationToEdit) {
      setSelectedLocation(locationToEdit);
    } else {
      toast("Error", { description: "Location not found." });
    }
  };

  const handleCloseDialog = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Your Travel Locations
      </h1>
      <p className="text-gray-600">A list of all your locations.</p>
      {loadingCreateLocation?.location && (
        <LocationCard isLoading location={loadingCreateLocation?.location} />
      )}
      {isPending
        ? Array(3)
            .fill(0)
            .map((_, i) => <LocationCard key={i} isLoading />)
        : data?.locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={handleEdit}
            />
          ))}
      {selectedLocation && (
        <LocationEditDialog
          id={selectedLocation.id}
          initialName={selectedLocation.name}
          initialAddress={selectedLocation.address}
          initialFavorite={selectedLocation.favorite}
          initialLatitude={selectedLocation.latitude}
          initialLongitude={selectedLocation.longitude}
          initialStartDate={selectedLocation.startDate}
          initialEndDate={selectedLocation.endDate}
          initialVisited={selectedLocation.visited}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

function LocationCard({
  location,
  isLoading,
  onEdit,
}: {
  location?: any;
  isLoading?: boolean;
  onEdit?: (id: number) => void;
}) {
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          {isLoading ? (
            <Skeleton className="h-5 w-40 rounded" />
          ) : (
            location.name
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p className="font-medium text-gray-700">Address</p>
          <p>
            {isLoading ? (
              <Skeleton className="h-4 w-56 rounded" />
            ) : (
              location.address
            )}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Start Date</p>
          <p>
            {isLoading ? (
              <Skeleton className="h-4 w-32 rounded" />
            ) : (
              location.startDate
            )}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700">End Date</p>
          <p>
            {isLoading ? (
              <Skeleton className="h-4 w-32 rounded" />
            ) : (
              location.endDate
            )}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700">Visited</p>
          <p>
            {isLoading ? (
              <Skeleton className="h-4 w-12 rounded" />
            ) : location.visited ? (
              "✅"
            ) : (
              "❌"
            )}
          </p>
        </div>
        <div>
          {location?.favorite !== false && (
            <>
              <p className="font-medium text-gray-700">Favorite</p>
              <p>
                {isLoading ? (
                  <Skeleton className="h-4 w-12 rounded" />
                ) : location?.favorite ? (
                  "⭐"
                ) : (
                  ""
                )}
              </p>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <>
            {onEdit && <LocationEditButton id={location.id} onEdit={onEdit} />}
            <LocationDeleteButton id={location.id} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function LocationDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteLocation,
    onError: () => {
      toast("Error", {
        description: `Failed to delete location: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Location Deleted", {
        description: `Successfully deleted location: ${id}`,
      });

      queryClient.setQueryData(
        getAllLocationsQueryOptions.queryKey,
        (existingLocations) => ({
          ...existingLocations,
          locations: existingLocations!.locations.filter((e) => e.id !== id),
        })
      );
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      variant="outline"
      size="icon"
      className="hover:bg-red-50 hover:text-red-600"
    >
      {mutation.isPending ? "..." : <Trash className="h-4 w-4" />}
    </Button>
  );
}

function LocationEditButton({
  id,
  onEdit,
}: {
  id: number;
  onEdit: (id: number) => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="hover:bg-blue-50 hover:text-blue-600"
      onClick={() => onEdit(id)}
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
}

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

function LocationEditDialog({
  id,
  initialName,
  initialVisited,
  initialLatitude,
  initialLongitude,
  initialAddress,
  initialStartDate,
  initialEndDate,
  initialFavorite,
  onClose,
}: {
  id: number;
  initialName: string;
  initialVisited: boolean;
  initialLatitude: string;
  initialLongitude: string;
  initialAddress: string;
  initialStartDate: string;
  initialEndDate: string;
  initialFavorite: boolean;
  onClose: () => void;
}) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: initialName,
      visited: initialVisited,
      latitude: initialLatitude,
      longitude: initialLongitude,
      address: initialAddress,
      startDate: initialStartDate,
      endDate: initialEndDate,
      favorite: initialFavorite,
    },
    onSubmit: async (data) => {
      const updatedLocation = {
        id,
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

  const googleMapsApiKey = useGoogleMapsApiKey();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editLocation,
    onError: () => {
      toast("Error", {
        description: `Failed to update location: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Location Updated", {
        description: `Successfully updated location: ${id}`,
      });

      queryClient.setQueryData(
        getAllLocationsQueryOptions.queryKey,
        (existingLocations) => ({
          ...existingLocations,
          locations: existingLocations!.locations.filter((e) => e.id !== id),
        })
      );
      onClose();
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Make changes to your location here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
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
              onChange: createLocationSchema.shape.address,
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={initialEndDate}
              onChange={(e) =>
                setLocation({ ...location, endDate: e.target.value })
              }
              required
              className="col-span-3"
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

          <DialogFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Editing Location..." : "Edit Location"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
