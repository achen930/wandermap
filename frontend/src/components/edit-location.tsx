import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LocationEditDialog({
  id,
  initialName,
  initialDescription,
  onClose,
}: {
  id: number;
  initialName: string;
  initialDescription: string;
  onClose: () => void;
}) {
  const [location, setLocation] = useState<{
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    // Fetch location data based on the ID
    const fetchLocation = async () => {
      const response = await fetch(`/locations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLocation(data.location);
      } else {
        // Handle error
        console.error("Location not found");
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const updatedLocation = {
      name: form.name.valueOf,
      description: form.description.value,
    };

    const response = await fetch(`/locations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLocation),
    });

    if (response.ok) {
      const updatedData = await response.json();
      console.log("Location updated:", updatedData);
      // Handle success (close dialog, redirect, etc.)
    } else {
      // Handle error
      console.error("Failed to update location");
    }
  };

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={true}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Make changes to your location here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={initialName}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              defaultValue={initialDescription}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
