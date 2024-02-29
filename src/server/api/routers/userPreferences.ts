import { eq } from "drizzle-orm";
import { updateUserPreferencesInput } from "~/server/api/schemas/userPreferences";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userPreferences } from "~/server/db/schema";

export const userPreferencesRouter = createTRPCRouter({
  find: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, ctx.session.user.id),
    });
  }),
  update: protectedProcedure
    .input(updateUserPreferencesInput)
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .update(userPreferences)
        .set(input)
        .where(eq(userPreferences.userId, ctx.session.user.id));
    }),
});
