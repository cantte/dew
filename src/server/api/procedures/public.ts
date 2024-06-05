import rateLimit from "~/server/api/middlewares/ratelimit";
import { trpcContext } from "~/server/api/trpc";

const publicProcedure = trpcContext.procedure.use(rateLimit);

export default publicProcedure;
