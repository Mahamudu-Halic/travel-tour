import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const RefundActionButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-600 justify-start">
          Refund
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default RefundActionButton;
