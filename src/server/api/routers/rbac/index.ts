import authedProcedure from "~/server/api/procedures/authed";
import checkPermissions from "~/server/api/routers/rbac/checkPermissions";
import { checkPermissionsInput } from "~/server/api/schemas/rbac";
import { router } from "~/server/api/trpc";

const rbacRouter = router({
  checkPermissions: authedProcedure
    .input(checkPermissionsInput)
    .query(async ({ ctx, input }) => {
      return await checkPermissions({ ctx, input });
    }),
});

export default rbacRouter;
