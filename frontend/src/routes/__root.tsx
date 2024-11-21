import { type QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
});

function NavBar() {
	return (
		<div className="p-2 flex gap-2 max-w-2xl m-auto">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>{" "}
			<Link to="/about" className="[&.active]:font-bold">
				About
			</Link>
			<Link to="/locations" className="[&.active]:font-bold">
				Location
			</Link>
			<Link to="/add-location" className="[&.active]:font-bold">
				Add
			</Link>
			<Link to="/profile" className="[&.active]:font-bold">
				Profile
			</Link>
		</div>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<div className="p-2 gap-2 max-w-2xl m-auto">
				<Outlet />
			</div>
			<TanStackRouterDevtools />
		</>
	);
}
