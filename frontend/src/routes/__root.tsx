import { type QueryClient } from "@tanstack/react-query";
import {
    createRootRouteWithContext,
    Link,
    Outlet,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/api";
import { UserRound, CirclePlus, MapPinned, House } from "lucide-react";

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
        <div className="w-full flex items-center justify-between lg:px-6">
            <Link to="/" className="[&.active]:font-bold">
                <h1 className="text-2xl font-bold p-4">Wandermap</h1>
            </Link>
            <div className="fixed bottom-0 w-full bg-white border-t lg:static lg:border-none">
                <div className="flex items-baseline justify-between p-4 m-auto">
                    <div className="w-full justify-between lg:justify-end flex gap-2">
                        <Link
                            to="/locations"
                            className="flex-1 lg:flex-none flex flex-col items-center h-full px-4 [&.active]:bg-[#8DB9A5] lg:[&.active]:bg-white lg:[&.active]:font-bold rounded-full"
                        >
                            <MapPinned className="lg:hidden" />
                            <p>Locations</p>
                        </Link>
                        <Link
                            to="/"
                            className="flex-1 lg:flex-none flex flex-col items-center h-full px-4 [&.active]:bg-[#8DB9A5] lg:[&.active]:bg-white lg:[&.active]:font-bold rounded-full lg:hidden"
                        >
                            <House />
                            <p>Home</p>
                        </Link>
                        <Link
                            to="/add-location"
                            className="flex-1 lg:flex-none flex flex-col items-center h-full px-4 [&.active]:bg-[#8DB9A5] lg:[&.active]:bg-white lg:[&.active]:font-bold rounded-full"
                        >
                            <CirclePlus className="lg:hidden" />
                            <p>Add</p>
                        </Link>
                        <Link
                            to="/profile"
                            className="flex-1 lg:flex-none flex flex-col items-center h-full px-4 [&.active]:bg-[#8DB9A5] lg:[&.active]:bg-white lg:[&.active]:font-bold rounded-full"
                        >
                            <UserRound className="lg:hidden" />
                            <p className="">Profile</p>
                        </Link>
                    </div>
                </div>
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
