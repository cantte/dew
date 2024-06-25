import { useState } from 'react'
import type { Product } from '~/app/(dashboard)/dashboard/products/columns'
import Barcode from '~/components/barcode'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'

type Props = {
  product: Product
}

const BarcodeModal = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Generar código de barras
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Código de barras</DialogTitle>
          <DialogDescription>
            Código de barras del producto <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <Barcode
            value={product.code}
            options={{
              displayValue: false,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BarcodeModal
