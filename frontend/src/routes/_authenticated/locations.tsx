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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
          onClose={() => setSelectedLocation(null)}
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
  const [location, setLocation] = useState({
    name: initialName,
    visited: initialVisited,
    latitude: initialLatitude,
    longitude: initialLongitude,
    address: initialAddress,
    startDate: initialStartDate,
    endDate: initialEndDate,
    favorite: initialFavorite,
  });

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
          locations: existingLocations!.locations.map((e) =>
            e.id === id ? { ...e, ...location } : e
          ),
        })
      );
      onClose();
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedLocation = {
      id,
      updates: {
        name: location.name,
        visited: location.visited,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        startDate: location.startDate,
        endDate: location.endDate,
        favorite: location.favorite,
      },
    };

    mutation.mutate(updatedLocation);
  };

  return (
    <Dialog open={true}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Make changes to your location here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={location.name}
              onChange={(e) =>
                setLocation({ ...location, name: e.target.value })
              }
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="visited" className="text-right">
              Visited
            </Label>
            <Input
              id="visited"
              type="checkbox"
              checked={location.visited}
              onChange={(e) =>
                setLocation({ ...location, visited: e.target.checked })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="latitude" className="text-right">
              Latitude
            </Label>
            <Input
              id="latitude"
              value={location.latitude}
              onChange={(e) =>
                setLocation({ ...location, latitude: e.target.value })
              }
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longitude" className="text-right">
              Longitude
            </Label>
            <Input
              id="longitude"
              value={location.longitude}
              onChange={(e) =>
                setLocation({ ...location, longitude: e.target.value })
              }
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={location.startDate}
              onChange={(e) =>
                setLocation({ ...location, startDate: e.target.value })
              }
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={location.endDate}
              onChange={(e) =>
                setLocation({ ...location, endDate: e.target.value })
              }
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="favorite" className="text-right">
              Favorite
            </Label>
            <Input
              id="favorite"
              type="checkbox"
              checked={location.favorite}
              onChange={(e) =>
                setLocation({ ...location, favorite: e.target.checked })
              }
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
