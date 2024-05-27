import { useDebounce } from "@uidotdev/usehooks";
import { CommandLoading } from "cmdk";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

type SearchedProduct = NonNullable<RouterOutputs["product"]["search"]>[number];

type Props = {
  suggestions: RouterOutputs["product"]["suggestions"];

  onSelect: (productCode: string) => void;
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

  const [query, setQuery] = useState("");
  const finalQuery = useDebounce(query, 250);

  const store = api.store.findCurrent.useQuery();
  const search = api.product.search.useQuery(
    {
      query: finalQuery,
      storeId: store.data?.id ?? "",
    },
    {
      enabled: open && finalQuery.length > 0 && store.data !== undefined,
    },
  );

  const [products, setProducts] = useState<SearchedProduct[]>([]);
  useEffect(() => {
    if (search.data) {
      setProducts(search.data);
    }
  }, [search.data]);

  const handleSelect = (value: string) => {
    const [id] = value.split("@");
    const product = products.find((product) => product.id === id);
    if (product) {
      onSelect(product.code);
    }

    const suggestion = suggestions.find((product) => product.id === id);
    if (suggestion) {
      onSelect(suggestion.code);
    }

    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md" shouldFilter={false}>
          <CommandInput onValueChange={setQuery} />
          <CommandList>
            {!search.isFetching && products.length === 0 && (
              <CommandEmpty>No se encontraron productos</CommandEmpty>
            )}

            <CommandGroup heading="Sugerencias">
              {suggestions.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.id}@${product.name}`}
                  onSelect={handleSelect}
                >
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {products.length > 0 && (
              <CommandGroup heading="Resultados">
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.id}@${product.name}`}
                    onSelect={handleSelect}
                  >
                    {product.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {search.isFetching && (
              <CommandLoading className="py-6 text-center text-sm">
                Cargando datos...
              </CommandLoading>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default FindProduct;
