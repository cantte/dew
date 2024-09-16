'use client'

import { Barcode, Package } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { formatToCurrency } from '~/text/format'

type Product = {
  id: string
  name: string
  code: string
  salePrice: number
  quantity: number
  isLowStock: boolean
}

type Props = {
  product: Product
  onAddProduct: (productId: string) => void
}

export const ProductSaleCard = ({ product, onAddProduct }: Props) => {
  return (
    <Card
      className="w-full transition-all duration-300 hover:bg-muted-foreground/10"
      onClick={() => onAddProduct(product.id)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>

          {product.isLowStock && (
            <Badge variant="destructive">Poco stock</Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="font-bold">
            {formatToCurrency('es-CO', product.salePrice)}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Barcode className="mr-2 h-4 w-4" />
            {product.code}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Package className="mr-2 h-4 w-4" />
            {product.quantity} en stock
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
