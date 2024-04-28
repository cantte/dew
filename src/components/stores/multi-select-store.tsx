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

  onSelect: (value: string) => void;
};

const MultiSelectStore = ({ stores, currentStores, onSelect }: Props) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            ¿En qué tiendas se venderá este producto?
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          {stores.map((store) => {
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
