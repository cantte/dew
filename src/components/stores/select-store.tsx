'use client'

import { useMediaQuery } from '@uidotdev/usehooks'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CreateStoreForm from '~/app/(dashboard)/stores/create/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  currentStore: RouterOutputs['store']['find']
  stores: RouterOutputs['store']['list']

  canCreateStore: boolean
}

const SelectStore = ({ currentStore, stores, canCreateStore }: Props) => {
  const [value, setValue] = useState(currentStore?.id)
  const [open, setOpen] = useState(false)

  const updateUserPreference = api.userPreference.update.useMutation()
  const onSelect = (value: string) => {
    if (value === 'new-store') {
      setOpen(true)
      return
    }

    setValue(value)
    updateUserPreference.mutate({ storeId: value })
  }

  const router = useRouter()
  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      router.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess])

  useEffect(() => {
    setValue(currentStore?.id)
  }, [currentStore])

  const onSuccessfulCreate = () => {
    setOpen(false)
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-[180px]">
          {currentStore !== undefined ? (
            <SelectValue
              defaultValue={currentStore.id}
              placeholder={currentStore.name}
            />
          ) : (
            <SelectValue placeholder="Seleccionar tienda" />
          )}
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              {store.name}
            </SelectItem>
          ))}

          {canCreateStore && (
            <SelectItem value="new-store">
              <div className="flex flex-row items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Crear nueva tienda</span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva tienda</DialogTitle>
            </DialogHeader>

            <CreateStoreForm onSuccess={onSuccessfulCreate} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Crear nueva tienda</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 py-1">
              <CreateStoreForm onSuccess={onSuccessfulCreate} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default SelectStore
