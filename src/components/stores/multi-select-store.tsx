"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RouterOutputs } from "~/trpc/shared";

type Props = {
  stores: RouterOutputs["store"]["list"];
  currentStores: RouterOutputs["store"]["list"];

  onSelectedChange: (value: RouterOutputs["store"]["list"]) => void;
};

const MultiSelectStore = ({
  stores,
  currentStores,
  onSelectedChange,
}: Props) => {
  const onSelect = (storeId: string) => {
    const store = stores.find((store) => store.id === storeId);

    if (!store) {
      return;
    }

    const exists = currentStores.some(
      (currentStore) => currentStore.id === store.id,
    );

    if (!exists) {
      onSelectedChange([...currentStores, store]);
      return;
    }

    onSelectedChange(
      currentStores.filter((currentStore) => currentStore.id !== store.id),
    );
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            ¿En qué tiendas se venderá este producto?
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          {stores?.map((store) => {
            const isSelected = currentStores.some(
              (currentStore) => currentStore.id === store.id,
            );

            return (
              <DropdownMenuCheckboxItem
                checked={isSelected}
                key={store.id}
                onCheckedChange={() => onSelect(store.id)}
              >
                {store.name}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiSelectStore;
