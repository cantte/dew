import { sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { upsertSaleSummaryInput } from '~/server/api/schemas/sales'
import { saleSummary } from '~/server/db/schema/sales'

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext['db']['transaction']>[0]
>[0]

type Options = {
  tx: DbTransaction
  input: TypeOf<typeof upsertSaleSummaryInput>
}

const upsertSaleSummary = async ({ tx, input }: Options) => {
  await tx
    .insert(saleSummary)
    .values({
      ...input,
      id: uuid(),
      date: input.date.toISOString().split('T')[0],
    })
    .onConflictDoUpdate({
      target: [saleSummary.date, saleSummary.storeId],
      set: {
        amount: sql`${saleSummary.amount} + EXCLUDED.amount`,
        profit: sql`${saleSummary.profit} + EXCLUDED.profit`,
        products: sql`${saleSummary.products} + EXCLUDED.products`,
        customers: sql`${saleSummary.customers} + EXCLUDED.customers`,
        sales: sql`${saleSummary.sales} + EXCLUDED.sales`,
      },
    })
}

export default upsertSaleSummary
