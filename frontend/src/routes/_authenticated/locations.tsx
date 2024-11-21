import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/locations')({
  component: Locations,
})

async function getAllLocations() {
  // await new Promise((r) => setTimeout(r, 2000));
  const res = await api.locations.$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data
}

function Locations() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-locations'],
    queryFn: getAllLocations,
  })
  return (
    <div className="p-2">
      Show All Locations
      <Table>
        <TableCaption>A list of all your locations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
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
                  </TableRow>
                ))
            : data?.locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.id}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.visited ? 'yes' : 'no'}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
