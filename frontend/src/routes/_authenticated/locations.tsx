import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLocationsQueryOptions,
  loadingCreateLocationQueryOptions,
  deleteLocation,
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
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/locations")({
  component: Locations,
});

function Locations() {
  const navigate = useNavigate();
  const { isPending, error, data } = useQuery(getAllLocationsQueryOptions);
  const { data: loadingCreateLocation } = useQuery(
    loadingCreateLocationQueryOptions
  );

  if (error)
    return (
      <div className="text-red-500">An error has occurred: {error.message}</div>
    );

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
              onEdit={() => navigate({ to: `/edit-location/${location.id}` })}
            />
          ))}
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
