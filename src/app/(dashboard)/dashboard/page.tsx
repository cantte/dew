"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import CreateCustomerModal from "~/components/customers/create-customer.modal";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={() => setOpen(true)}>Open modal</Button>

      <CreateCustomerModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default DashboardPage;
