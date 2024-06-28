import authedProcedure from '~/server/api/procedures/authed'
import { listUserMenus } from '~/server/api/routers/menus/list'
import { router } from '~/server/api/trpc'

export const menusRouter = router({
  list: authedProcedure.query(async ({ ctx }) => {
    return await listUserMenus({ ctx })
  }),
})
