"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const TourActions = ({ tourId, title }: { tourId: string; title: string }) => {
  const supabase = createClient();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const handleDeleteTour = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from("tours").delete().eq("id", tourId);
      if (error) {
        toast.error(error.message);
      }
      toast.success(`Tour "${title}" deleted successfully`);
      router.refresh();
      setDeleteMenu(false);
    } catch {
      toast.error(`Tour "${title}" deleted failed`);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="flex gap-2 ml-4">
      <Button variant="outline" size="sm" disabled>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Dialog open={deleteMenu} onOpenChange={setDeleteMenu}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tour</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold">{title}</span> tour?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={deleting} onClick={handleDeleteTour}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TourActions;
