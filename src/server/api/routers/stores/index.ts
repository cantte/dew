import authedProcedure from '~/server/api/procedures/authed'
import createStore from '~/server/api/routers/stores/create'
import findStore from '~/server/api/routers/stores/find'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import listStores from '~/server/api/routers/stores/list'
import updateStore from '~/server/api/routers/stores/update'
import {
  createStoreInput,
  findStoreInput,
  updateStoreInput,
} from '~/server/api/schemas/stores'
import { router } from '~/server/api/trpc'

const storesRouter = router({
  create: authedProcedure
    .input(createStoreInput)
    .mutation(async ({ ctx, input }) => {
      await createStore({ ctx, input })
    }),
  find: authedProcedure.input(findStoreInput).query(async ({ ctx, input }) => {
    return await findStore({ ctx, input })
  }),
  list: authedProcedure.query(async ({ ctx }) => {
    return await listStores({ ctx })
  }),
  update: authedProcedure
    .input(updateStoreInput)
    .mutation(async ({ ctx, input }) => {
      await updateStore({ ctx, input })
    }),
  findCurrent: authedProcedure.query(async ({ ctx }) => {
    return await findCurrentStore({ ctx })
  }),
})

export default storesRouter
