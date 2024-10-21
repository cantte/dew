import authedProcedure from '~/server/api/procedures/authed'
import { acceptInvitationLink } from '~/server/api/routers/employees/accept-invitation-link'
import findEmployeesByStore from '~/server/api/routers/employees/byStore'
import createEmployee from '~/server/api/routers/employees/create'
import findEmployee from '~/server/api/routers/employees/find'
import { findEmployeeById } from '~/server/api/routers/employees/find-by-id'
import { findInvitationLink } from '~/server/api/routers/employees/find-invitation-link'
import updateEmployee from '~/server/api/routers/employees/update'
import { byStoreInput } from '~/server/api/schemas/common'
import {
  createEmployeeInput,
  findEmployeeInput,
  findInvitationLinkInput,
  updateEmployeeInput,
} from '~/server/api/schemas/employees'
import { router } from '~/server/api/trpc'

const employeesRouter = router({
  create: authedProcedure
    .input(createEmployeeInput)
    .mutation(async ({ ctx, input }) => {
      await createEmployee({ ctx, input })
    }),
  find: authedProcedure
    .input(findEmployeeInput)
    .query(async ({ ctx, input }) => {
      return await findEmployee({ ctx, input })
    }),
  findById: authedProcedure
    .input(findEmployeeInput)
    .query(async ({ ctx, input }) => {
      return await findEmployeeById({ ctx, input })
    }),
  byStore: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await findEmployeesByStore({ ctx, input })
  }),
  update: authedProcedure
    .input(updateEmployeeInput)
    .mutation(async ({ ctx, input }) => {
      await updateEmployee({ ctx, input })
    }),
  findInvitationLink: authedProcedure
    .input(findInvitationLinkInput)
    .query(async ({ ctx, input }) => {
      return await findInvitationLink({ ctx, input })
    }),
  acceptInvitationLink: authedProcedure
    .input(findInvitationLinkInput)
    .mutation(async ({ ctx, input }) => {
      return await acceptInvitationLink({ ctx, input })
    }),
})

export default employeesRouter
