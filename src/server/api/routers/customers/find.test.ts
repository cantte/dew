import { eq } from 'drizzle-orm'
import { describe, expect, it, vi } from 'vitest'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findCustomerInput } from '~/server/api/schemas/customers'
import { customers } from '~/server/db/schema'
import findCustomer from './find'

describe('findCustomer', () => {
  it('should return customer data when customer is found', async () => {
    const mockCtx: TRPCAuthedContext = {
      db: {
        query: {
          customers: {
            findFirst: vi.fn().mockResolvedValue({
              id: '123',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '123-456-7890',
            }),
          },
        },
      },
    } as unknown as TRPCAuthedContext

    const input: TypeOf<typeof findCustomerInput> = {
      id: '123',
    }

    const result = await findCustomer({ ctx: mockCtx, input })

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
    })
    expect(mockCtx.db.query.customers.findFirst).toHaveBeenCalledWith({
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      where: eq(customers.id, '123'),
    })
  })

  it('should return null when customer is not found', async () => {
    const mockCtx: TRPCAuthedContext = {
      db: {
        query: {
          customers: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        },
      },
    } as unknown as TRPCAuthedContext

    const input: TypeOf<typeof findCustomerInput> = {
      id: '321',
    }

    const result = await findCustomer({ ctx: mockCtx, input })

    expect(result).toBeNull()
    expect(mockCtx.db.query.customers.findFirst).toHaveBeenCalledWith({
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      where: eq(customers.id, '321'),
    })
  })
})
