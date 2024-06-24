import authedProcedure from "~/server/api/procedures/authed";
import createProduct from "~/server/api/routers/products/create";
import createProductDiscount from "~/server/api/routers/products/createDiscount";
import deleteProduct from "~/server/api/routers/products/delete";
import checkProductExistence from "~/server/api/routers/products/exists";
import findProduct from "~/server/api/routers/products/find";
import findProductById from "~/server/api/routers/products/findById";
import findProductForSale from "~/server/api/routers/products/findForSale";
import linkProductToStores from "~/server/api/routers/products/linkToStores";
import listProducts from "~/server/api/routers/products/list";
import searchMostSoldProducts from "~/server/api/routers/products/mostSold";
import productsOverview from "~/server/api/routers/products/overview";
import searchProducts from "~/server/api/routers/products/search";
import searchProductDiscounts from "~/server/api/routers/products/searchDiscount";
import searchProductSummary from "~/server/api/routers/products/searchSummary";
import listProductStores from "~/server/api/routers/products/stores";
import getProductSuggestions from "~/server/api/routers/products/suggestions";
import updateProduct from "~/server/api/routers/products/update";
import { byStoreInput } from "~/server/api/schemas/common";
import {
    byCodeProductInput,
    byProductIdInput,
    createProductDiscountInput,
    createProductInput,
    linkToStoresInput,
    searchProductsInput,
    updateProductInput,
} from "~/server/api/schemas/products";
import { router } from "~/server/api/trpc";

const productsRouter = router({
  create: authedProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      await createProduct({ ctx, input });
    }),
  list: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await listProducts({ ctx, input });
  }),
  exists: authedProcedure
    .input(byCodeProductInput)
    .query(async ({ ctx, input }) => {
      return await checkProductExistence({ ctx, input });
    }),
  find: authedProcedure
    .input(byCodeProductInput)
    .query(async ({ ctx, input }) => {
      return await findProduct({ ctx, input });
    }),
  findById: authedProcedure
    .input(byProductIdInput)
    .query(async ({ ctx, input }) => {
      return await findProductById({ ctx, input });
    }),
  findForSale: authedProcedure
    .input(byCodeProductInput)
    .query(async ({ ctx, input }) => {
      return await findProductForSale({ ctx, input });
    }),
  update: authedProcedure
    .input(updateProductInput)
    .mutation(async ({ ctx, input }) => {
      await updateProduct({ ctx, input });
    }),
  delete: authedProcedure
    .input(byProductIdInput)
    .mutation(async ({ ctx, input }) => {
      await deleteProduct({ ctx, input });
    }),
  linkToStores: authedProcedure
    .input(linkToStoresInput)
    .mutation(async ({ ctx, input }) => {
      await linkProductToStores({ ctx, input });
    }),
  stores: authedProcedure
    .input(byProductIdInput)
    .query(async ({ ctx, input }) => {
      return await listProductStores({ ctx, input });
    }),
  overview: authedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return await productsOverview({ ctx, input });
    }),
  search: authedProcedure
    .input(searchProductsInput)
    .query(async ({ ctx, input }) => {
      return await searchProducts({ ctx, input });
    }),
  suggestions: authedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return await getProductSuggestions({ ctx, input });
    }),
  createDiscount: authedProcedure
    .input(createProductDiscountInput)
    .mutation(async ({ ctx, input }) => {
      await createProductDiscount({ ctx, input });
    }),
  searchDiscounts: authedProcedure
    .input(byProductIdInput)
    .query(async ({ ctx, input }) => {
      return await searchProductDiscounts({ ctx, input });
    }),
  searchSummary: authedProcedure
    .input(byProductIdInput)
    .query(async ({ ctx, input }) => {
      return await searchProductSummary({ ctx, input });
    }),
  mostSold: authedProcedure.query(async ({ ctx }) => {
    return await searchMostSoldProducts({ ctx });
  }),
});

export default productsRouter;
