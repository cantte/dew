import { describe, expect, it, vi } from 'vitest'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createCustomerInput } from '~/server/api/schemas/customers'
import { customers } from '~/server/db/schema/customers'
import createCustomer from './create'

describe('createCustomer', () => {
  it('should insert a new customer with the correct values', async () => {
    const mockInsert = vi.fn().mockReturnThis()
    const mockValues = vi.fn().mockResolvedValue(undefined)
    const mockDb = {
      insert: mockInsert.mockReturnValue({ values: mockValues }),
    }

    const mockCtx: TRPCAuthedContext = {
      db: mockDb,
      session: {
        user: {
          id: 'user-123',
        },
      },
    } as unknown as TRPCAuthedContext

    const input: TypeOf<typeof createCustomerInput> = {
      id: 'customer-123',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    await createCustomer({ ctx: mockCtx, input })

    expect(mockInsert).toHaveBeenCalledWith(customers)
    expect(mockValues).toHaveBeenCalledWith({
      ...input,
      createdBy: 'user-123',
    })
  })

  it('should handle errors during insertion', async () => {
    const mockInsert = vi.fn().mockReturnThis()
    const mockValues = vi.fn().mockRejectedValue(new Error('Insertion error'))
    const mockDb = {
      insert: mockInsert.mockReturnValue({ values: mockValues }),
    }

    const mockCtx: TRPCAuthedContext = {
      db: mockDb,
      session: {
        user: {
          id: 'user-123',
        },
      },
    } as unknown as TRPCAuthedContext

    const input: TypeOf<typeof createCustomerInput> = {
      id: 'customer-123',
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    await expect(createCustomer({ ctx: mockCtx, input })).rejects.toThrow(
      'Insertion error',
    )
  })
})
