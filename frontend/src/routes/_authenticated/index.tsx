import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

async function getTotalLocations() {
  const res = await api.locations['total-locations'].$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-total-locations'],
    queryFn: getTotalLocations,
  })

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Total Locations</CardTitle>
          <CardDescription>The total locations you've been to</CardDescription>
          <CardContent>{isPending ? '...' : data.total}</CardContent>
        </CardHeader>
      </Card>
    </>
  )
}
