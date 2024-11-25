import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLocationsQueryOptions,
  loadingCreateLocationQueryOptions,
  deleteLocation,
} from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/locations")({
  component: Locations,
});

function Locations() {
  const { isPending, error, data } = useQuery(getAllLocationsQueryOptions);
  const { data: loadingCreateLocation } = useQuery(
    loadingCreateLocationQueryOptions
  );

  if (error) return "An error has occured: " + error.message;
  return (
    <div className="p-2">
      <Table>
        <TableCaption>A list of all your locations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Visited</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreateLocation?.location && (
            <TableRow>
              <TableCell className="font-medium">
                <Skeleton className="h-4 rounded-full" />
              </TableCell>
              <TableCell>{loadingCreateLocation?.location.name}</TableCell>
              <TableCell>{loadingCreateLocation?.location.address}</TableCell>
              <TableCell>
                {loadingCreateLocation?.location.startDate.split("T")[0]}
              </TableCell>
              <TableCell>
                {loadingCreateLocation?.location.endDate.split("T")[0]}
              </TableCell>
              <TableCell>
                {loadingCreateLocation?.location.visited ? "yes" : "no"}
              </TableCell>
              <TableCell>
                <Skeleton className=" h-4 rounded-full" />
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className=" h-4 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.id}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.startDate}</TableCell>
                  <TableCell>{location.endDate}</TableCell>
                  <TableCell>{location.visited ? "yes" : "no"}</TableCell>
                  <TableCell>
                    <LocationDeleteButton id={location.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
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
        description: `Successfully deleted expense: ${id}`,
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
    >
      {mutation.isPending ? "..." : <Trash className="h-4 w-4" />}
    </Button>
  );
}
