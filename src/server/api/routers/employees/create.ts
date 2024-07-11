import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import EmployeeStoreInvitationEmail from '~/emails/employee-store-invitation'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createEmployeeInput } from '~/server/api/schemas/employees'
import { employeeStore, employees, roles, stores } from '~/server/db/schema'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createEmployeeInput>
}

const createEmployee = async ({ ctx, input }: Options) => {
  const { storeId, ...data } = input
  await ctx.db.transaction(async (tx) => {
    const employeeId = uuid()

    await tx
      .insert(employees)
      .values({
        ...data,
        id: employeeId,
        createdBy: ctx.session.user.id,
      })
      .onConflictDoUpdate({
        target: employees.id,
        set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      })

    // After creating an employee, link to store
    const employeeRole = await tx.query.roles.findFirst({
      columns: {
        id: true,
      },
      where: eq(roles.name, 'employee'),
    })

    if (!employeeRole) {
      try {
        tx.rollback()
      } catch (error) {
        throw new Error('Employee role not found')
      }
      return
    }

    await tx
      .insert(employeeStore)
      .values({
        employeeId: employeeId,
        storeId: input.storeId,
        roleId: employeeRole.id,
      })
      .onConflictDoNothing()

    const storeQuery = await tx
      .select({
        name: stores.name,
      })
      .from(stores)
      .where(eq(stores.id, storeId))

    if (storeQuery.length === 0) {
      try {
        tx.rollback()
      } catch (error) {
        throw new Error('Store not found')
      }
    }

    const store = storeQuery.at(0)
    if (store === undefined) {
      try {
        tx.rollback()
      } catch (error) {
        throw new Error('Store not found')
      }
      return
    }

    // Send email to employee
    await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: data.email,
      subject: 'Has sido invitado a la tienda',
      react: EmployeeStoreInvitationEmail({
        employeeName: data.name,
        storeName: store.name,
        url: process.env.NEXT_PUBLIC_URL
          ? `${process.env.NEXT_PUBLIC_URL}/stores/${storeId}/accept-invitation?employeeId=${employeeId}`
          : `http://localhost:3000/stores/${storeId}/accept-invitation?employeeId=${employeeId}`,
      }),
    })
  })
}

export default createEmployee
