import { z } from 'zod'
import { byStoreInput } from '~/server/api/schemas/common'

export const createProductInput = z.object({
  code: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
  reference: z.string().optional(),
  name: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
  description: z.string().optional(),
  purchasePrice: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),
  salePrice: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),
  stock: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),
  quantity: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),

  unitId: z.string().uuid('unit_required'),
  storeId: z.string().uuid('store_required'),
})

export const bulkCreateProductInput = z.object({
  products: z
    .array(
      z.object({
        code: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
        name: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
        description: z.string().optional(),
        purchasePrice: z.coerce
          .number({
            invalid_type_error: 'invalid_number',
          })
          .min(0, 'must_be_positive_number'),
        salePrice: z.coerce
          .number({
            invalid_type_error: 'invalid_number',
          })
          .min(0, 'must_be_positive_number'),
        quantity: z.coerce
          .number({
            invalid_type_error: 'invalid_number',
          })
          .min(0, 'must_be_positive_number'),
        stock: z.coerce
          .number({
            invalid_type_error: 'invalid_number',
          })
          .min(0, 'must_be_positive_number'),
      }),
    )
    .min(1, 'at_least_one_product'),
  store: z.string().uuid('store_required'),
})

export const updateProductInput = z.object({
  id: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
  reference: z.string().optional(),
  name: z.string().min(1, 'not_empty_string').max(255, 'too_long_string'),
  description: z.string().optional(),
  purchasePrice: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),
  salePrice: z.coerce
    .number({
      invalid_type_error: 'invalid_number',
    })
    .min(0, 'must_be_positive_number'),
  enabled: z.boolean(),

  unitId: z.string().uuid('unit_required'),
})

export const linkToStoresInput = z.object({
  id: z.string().uuid(),
  stores: z.array(z.string().uuid()),
})

export const searchProductsInput = byStoreInput.extend({
  query: z.string().min(1).max(255),
})

export const byCodeProductInput = z.object({
  code: z.string().min(1).max(255),
})

export const byProductIdInput = z.object({
  id: z.string().uuid(),
})

export const createProductDiscountInput = z.object({
  productId: z.string().uuid(),
  isPercentage: z.boolean(),
  discount: z.coerce.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
})

export const upsertProductSummaryInput = z.array(
  z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    sales: z.coerce.number().min(0),
    amount: z.coerce.number(),
    profit: z.coerce.number(),
  }),
)
