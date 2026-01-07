import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

const statusOptions = [
  "confirmed",
  "pending",
  "completed",
  "cancelled",
];

const StatusFilter = async () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Status <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {statusOptions.map((status: string) => (
            <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilter;
