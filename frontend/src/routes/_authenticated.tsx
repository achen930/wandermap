import { createFileRoute, Outlet } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center mb-6">
        <img src="/logo.svg" alt="Wandermap Logo" width={150} height={150} />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">Wandermap</h1>
      <p className="text-lg text-gray-600 mb-6">
        Please log in or register to get started.
      </p>

      <div className="flex flex-col gap-y-4">
        <Button className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-lg transition-all duration-300">
          <a href="/api/login">Login</a>
        </Button>
        <Button className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-lg transition-all duration-300">
          <a href="/api/register">Register</a>
        </Button>
      </div>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions); // check if user is logged in
      return data;
    } catch (err) {
      return { user: null };
    }
  },
  component: Component,
});
