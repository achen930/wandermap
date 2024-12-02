import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Wandermap</h1>
      <p className="text-lg text-gray-700">
        Wandermap is your ultimate travel companion, designed to help you keep
        track of all your travel locations and destinations with ease. Whether
        you're an avid explorer or just love documenting your travels, Wandermap
        lets you mark, organize, and revisit all the places you've been — and
        plan the journeys ahead.
      </p>
      <p className="mt-4 text-lg text-gray-700">
        With an intuitive interface, you can easily add locations, share your
        favorite spots, and even track your favorite destinations. Wandermap
        helps you stay organized and make the most of every adventure, all in
        one place.
      </p>
    </div>
  );
}
