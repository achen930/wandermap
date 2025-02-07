import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/api";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (err) {
      return { user: null };
    }
  },
  component: Root,
});

function NavBar() {
  return (
    <div className="flex items-baseline justify-between p-2 max-w-2xl m-auto">
      <Link to="/" className="[&.active]:font-bold">
        <h1 className="text-2xl font-bold">Wandermap</h1>
      </Link>
      <div className="flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/locations" className="[&.active]:font-bold">
          Locations
        </Link>
        <Link to="/add-location" className="[&.active]:font-bold">
          Add
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
    </div>
  );
}

function Root() {
  const { user } = Route.useRouteContext();
  return (
    <>
      {user && <NavBar />}
      <hr />
      <div className="p-2 gap-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
