import { useEffect, useState } from "react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command";
import type { RouterOutputs } from "~/trpc/shared";

type Product = NonNullable<RouterOutputs["product"]["findForSale"]>;

type Props = {
  suggestions: RouterOutputs["sale"]["mostSoldProducts"];

  onSelect: (product: Product) => void;
};

const FindProduct = ({ onSelect, suggestions }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput />
          <CommandList>
            <CommandEmpty>No se encontraron productos</CommandEmpty>
            <CommandGroup heading="Sugerencias">
              {suggestions.map((product) => (
                <CommandItem key={product.id}>
                  <span>{product.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default FindProduct;
