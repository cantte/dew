'use client'

import CreateCustomerForm from '~/components/customers/create-customer.form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

type CreateCustomerModalProps = {
  open: boolean
  id?: string
  onOpenChange: (open: boolean) => void
}

const CreateCustomerModal = ({
  open,
  id,
  onOpenChange,
}: CreateCustomerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar cliente</DialogTitle>
        </DialogHeader>

        <CreateCustomerForm id={id} onCreate={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default CreateCustomerModal
