import authedProcedure from "~/server/api/procedures/authed";
import findUserPreference from "~/server/api/routers/userPreferences/find";
import updateUserPreference from "~/server/api/routers/userPreferences/update";
import { updateUserPreferencesInput } from "~/server/api/schemas/userPreferences";
import { router } from "~/server/api/trpc";

const userPreferencesRouter = router({
  find: authedProcedure.query(async ({ ctx }) => {
    return await findUserPreference(ctx);
  }),
  update: authedProcedure
    .input(updateUserPreferencesInput)
    .mutation(async ({ input, ctx }) => {
      return await updateUserPreference({ ctx, input });
    }),
});

export default userPreferencesRouter;
