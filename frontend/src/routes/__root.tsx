import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	return (
		<div className="p-2 flex gap-2">
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
		</div>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}
