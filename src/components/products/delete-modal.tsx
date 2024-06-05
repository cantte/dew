import { useEffect, useState } from "react";
import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import ConfirmDialog from "~/components/confirm-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

type Props = {
  product: Product;
};

const DeleteProductModal = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteProduct = api.product.delete.useMutation();

  const handleDelete = () => {
    deleteProduct.mutate({
      id: product.id,
    });
  };

  const utils = api.useUtils();
  useEffect(() => {
    if (deleteProduct.isSuccess) {
      void utils.product.list.invalidate();
      setIsOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteProduct.isSuccess]);

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </DropdownMenuItem>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        description="¿Estás seguro que deseas eliminar este producto?"
      />
    </>
  );
};

export default DeleteProductModal;
