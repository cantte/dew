import authedProcedure from '~/server/api/procedures/authed'
import findEmployeesByStore from '~/server/api/routers/employees/byStore'
import createEmployee from '~/server/api/routers/employees/create'
import findEmployee from '~/server/api/routers/employees/find'
import findEmployeeById from '~/server/api/routers/employees/findById'
import linkEmployeeToStore from '~/server/api/routers/employees/linkToStore'
import updateEmployee from '~/server/api/routers/employees/update'
import { byStoreInput } from '~/server/api/schemas/common'
import {
  createEmployeeInput,
  findEmployeeInput,
  linkToStoreInput,
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
  linkToStore: authedProcedure
    .input(linkToStoreInput)
    .mutation(async ({ ctx, input }) => {
      await linkEmployeeToStore({ ctx, input })
    }),
})

export default employeesRouter
