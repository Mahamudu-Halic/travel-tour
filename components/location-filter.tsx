import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { ToursType } from "./tours/types";
import { ChevronDown } from "lucide-react";

const LocationFilter = async () => {
  const supabase = await createClient();

  const { data: tours } = (await supabase
    .from("tours")
    .select("*")) as unknown as { data: ToursType[] };

  const locations = tours?.map((tour) => tour.title);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Location <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {locations.map((location: string) => (
            <DropdownMenuItem key={location}>
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationFilter;
