import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createStoreInput } from "~/server/api/schemas/stores";
import {
  employeeStore,
  employees,
  roles,
  stores,
  userPreferences,
} from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createStoreInput>;
};

const createStore = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const storeId = uuid();
    await tx.insert(stores).values({
      ...input,
      id: storeId,
      createdBy: ctx.session.user.id,
    });

    await tx
      .insert(userPreferences)
      .values({
        userId: ctx.session.user.id,
        storeId: storeId,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          storeId,
        },
      });

    const user = ctx.session.user;

    await tx
      .insert(employees)
      .values({
        id: user.id,
        name: user.name ?? "Sin nombre",
        email: user.email ?? "Sin email",
        userId: user.id,
        createdBy: user.id,
      })
      .onConflictDoNothing();

    const adminRole = await tx.query.roles.findFirst({
      columns: {
        id: true,
      },
      where: eq(roles.name, "admin"),
    });

    await tx.insert(employeeStore).values({
      employeeId: user.id,
      storeId: storeId,
      roleId: adminRole?.id,
    });
  });
};

export default createStore;
