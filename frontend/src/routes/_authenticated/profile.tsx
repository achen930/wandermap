import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
	component: Profile,
});

function Profile() {
	const { isPending, error, data } = useQuery(userQueryOptions);

	if (isPending) return "Loading...";
	if (error) return "Not logged in";

	return (
		<div>
			Hello from Profile
			<p>Hello {data.user.given_name}</p>
			<a href="/api/logout">Logout</a>
		</div>
	);
}
