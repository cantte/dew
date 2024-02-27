"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  store: NonNullable<RouterOutputs["store"]["find"]>;
};

const SelectStore = ({ store }: Props) => {
  const [value, setValue] = useState(store.id);

  const onSelect = (value: string) => {
    if (value === "new-store") {
      console.log("Create new store");
      setValue(store.id);
    }
  };

  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue defaultValue={store.id} placeholder={store.name} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={store.id}>{store.name}</SelectItem>
        <SelectItem value="new-store">
          <div className="flex flex-row items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Crear nueva tienda</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectStore;
