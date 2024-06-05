import { eq } from "drizzle-orm";
import { type TRPCAuthedContext } from "~/server/api/procedures/authed";
import { userPreferences } from "~/server/db/schema";

const findUserPreference = async (ctx: TRPCAuthedContext) => {
  return await ctx.db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, ctx.session.user.id),
  });
};

export default findUserPreference;
