"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type Props = {
  storeId: string;
};

const EnableCashButton = ({ storeId }: Props) => {
  const createCash = api.cashRegister.create.useMutation();

  const handleClick = () => {
    createCash.mutate({ storeId });
  };

  const router = useRouter();
  useEffect(() => {
    if (createCash.isSuccess) {
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCash.isSuccess]);

  return (
    <Button
      size="sm"
      className="mt-2"
      onClick={handleClick}
      disabled={createCash.isPending}
    >
      {createCash.isPending && (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      )}
      Habilitar caja registradora
    </Button>
  );
};

export default EnableCashButton;
