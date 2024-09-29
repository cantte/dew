import { useMediaQuery } from '@uidotdev/usehooks'
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

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RegisterStoreDialog = ({ open, onOpenChange }: Props) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSuccess = () => {
    onOpenChange(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar tienda</DialogTitle>
          </DialogHeader>

          <CreateStoreForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Registrar tienda</DrawerTitle>
        </DrawerHeader>

        <div className="p-4">
          <CreateStoreForm onSuccess={handleSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
