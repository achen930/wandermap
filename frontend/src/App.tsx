import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import "./App.css";

function App() {
	const [totalDestinations, setTotalDestinations] = useState(0);

	return (
		<>
			<div className="bg-background">
				<h1 className="text-3xl font-bold underline">Hello world!</h1>
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle>Create project</CardTitle>
						<CardDescription>
							Deploy your new project in one-click.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		</>
	);
}

export default App;
