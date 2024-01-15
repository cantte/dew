import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

type UpdateProductQuantityModalProps = {
  product: Product;
};

const UpdateProductQuantityModal = ({
  product,
}: UpdateProductQuantityModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Modificar existencia
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar existencia</DialogTitle>
          <DialogDescription>
            Modificar la existencia del producto <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input type="number" id="quantity" name="quantity" />

          <p className="text-[0.8rem] text-muted-foreground">
            Digite la cantidad a agregar o restar de la existencia actual del
            producto.
          </p>
        </div>

        <div className="flex flex-grow flex-row justify-between space-x-4">
          <DialogClose asChild>
            <Button className="grow">Restar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="grow">Agregar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductQuantityModal;
