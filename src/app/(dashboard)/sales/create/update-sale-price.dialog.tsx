import { Pen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import type { createSaleInput } from '~/server/api/schemas/sales'

type FormValues = TypeOf<typeof createSaleInput>

type Props = {
  productName: string
  index: number
}

const UpdateSalePriceDialog = ({ productName, index }: Props) => {
  const [open, setOpen] = useState(false)
  const form = useFormContext<FormValues>()

  const { setValue } = form
  const items = form.getValues('items')
  useEffect(() => {
    if (open) {
      return
    }

    const amount = items.reduce(
      (acc, item) => acc + item.quantity * item.salePrice,
      0,
    )
    setValue('amount', amount)
    setValue('payment', amount)
  }, [open, setValue, items])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" type="button" className="h-7 w-7">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar precio de venta unitario</DialogTitle>
          <DialogDescription>
            Estás a punto de actualizar el precio de venta unitario del producto{' '}
            <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name={`items.${index}.salePrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio de venta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Actualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateSalePriceDialog
