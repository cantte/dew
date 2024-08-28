import authedProcedure from '~/server/api/procedures/authed'
import checkPermissions from '~/server/api/routers/rbac/checkPermissions'
import { searchPermissions } from '~/server/api/routers/rbac/search-permissions'
import { checkPermissionsInput } from '~/server/api/schemas/rbac'
import { router } from '~/server/api/trpc'

const rbacRouter = router({
  checkPermissions: authedProcedure
    .input(checkPermissionsInput)
    .query(async ({ ctx, input }) => {
      return await checkPermissions({ ctx, input })
    }),
  list: authedProcedure.query(async ({ ctx }) => {
    return await searchPermissions({ ctx })
  }),
})

export default rbacRouter
