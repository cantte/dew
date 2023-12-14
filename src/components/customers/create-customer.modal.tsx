"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import CreateCustomerForm from "~/components/customers/create-customer.form";

type CreateCustomerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateCustomerModal = ({
  open,
  onOpenChange,
}: CreateCustomerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
        </DialogHeader>

        <CreateCustomerForm onCreate={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerModal;
