import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllLocationsQueryOptions } from "@/lib/api";
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

export const Route = createFileRoute("/_authenticated/locations")({
  component: Locations,
});

function Locations() {
  const { isPending, error, data } = useQuery(getAllLocationsQueryOptions);
  if (error) return "An error has occured: " + error.message;
  return (
    <div className="p-2">
      Show All Locations
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
          </TableRow>
        </TableHeader>
        <TableBody>
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
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
