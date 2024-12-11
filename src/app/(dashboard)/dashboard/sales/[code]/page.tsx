import { notFound } from 'next/navigation'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import { SaleDetail } from '~/components/sale-detail'
import { api } from '~/trpc/server'

type Props = {
  params: Promise<{
    code: string
  }>
}

const SaleDetailPage = async (props: Props) => {
  const params = await props.params
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const sale = await api.sale.find({ code: params.code })

  if (!sale) {
    return notFound()
  }

  return (
    <div className="grid gap-4">
      <div>
        <BackButton />
      </div>

      <SaleDetail sale={sale} />
    </div>
  )
}

export default SaleDetailPage
