"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  stores: RouterOutputs["store"]["list"];
  selectedStores: Array<string>;

  onSelectedChange: (value: Array<string>) => void;
};

const MultiSelectStore = ({
  stores,
  selectedStores,
  onSelectedChange,
}: Props) => {
  const onSelect = (storeId: string) => {
    const store = stores.find((store) => store.id === storeId);

    if (!store) {
      return;
    }

    const exists = selectedStores.some(
      (currentStore) => currentStore === store.id,
    );

    if (!exists) {
      onSelectedChange([...selectedStores, store.id]);
      return;
    }

    onSelectedChange(
      selectedStores.filter((currentStore) => currentStore !== store.id),
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
            const isSelected = selectedStores.some(
              (currentStore) => currentStore === store.id,
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
