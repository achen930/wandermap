import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useGoogleMapsApiKey } from "@/GoogleMapsContext";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getAllLocations() {
  const res = await api.locations.$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const { locations } = await res.json();
  console.log(locations);
  return locations;
}

function Index() {
  const {
    isPending,
    error,
    data: locations,
  } = useQuery({
    queryKey: ["get-total-locations"],
    queryFn: getAllLocations,
  });

  const googleMapsApiKey = useGoogleMapsApiKey();

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Total Locations</CardTitle>
          <CardDescription>The total locations you've been to</CardDescription>
          <CardContent>{isPending ? "..." : locations.length}</CardContent>
        </CardHeader>
      </Card>

      <div className="w-full h-[400px] mt-4">
        {isPending || !googleMapsApiKey ? (
          <Skeleton className="h-[100px] w-full" />
        ) : (
          <APIProvider apiKey={googleMapsApiKey}>
            <Map
              defaultZoom={10}
              defaultCenter={{ lat: 49.2827, lng: -123.1207 }} // Vancouver, BC
            ></Map>
          </APIProvider>
        )}
      </div>
    </>
  );
}
