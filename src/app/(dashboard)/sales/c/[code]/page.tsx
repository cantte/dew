import { notFound } from 'next/navigation'
import { SaleDetail } from '~/components/sale-detail'
import { api } from '~/trpc/server'

type Props = {
  params: Promise<{
    code: string
  }>
}

const CustomerSaleDetailPage = async (props: Props) => {
  const params = await props.params
  const sale = await api.sale.findPublic({ code: params.code })

  if (!sale) {
    return notFound()
  }

  return (
    <div className="grid w-full max-w-7xl">
      <SaleDetail sale={sale} />
    </div>
  )
}

export default CustomerSaleDetailPage
