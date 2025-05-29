/**
 * word controller
 */

import { factories } from "@strapi/strapi";

interface IGetWordsForGameParams {
  categories: string;
  wordsCount: number;
}

export default factories.createCoreController(
  "api::word.word",
  ({ strapi }) => ({
    async getWordsForGame(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      const { categories, wordsCount } =
        (sanitizedQueryParams as unknown as IGetWordsForGameParams) || {};

      const categoriesArray = categories.split(",");

      if (!categoriesArray || categoriesArray.length === 0) {
        return ctx.badRequest(
          "You must provide at least one category slug in the query parameters."
        );
      }

      console.log({ categoriesArray, wordsCount });

      if (!wordsCount || isNaN(Number(wordsCount))) {
        return ctx.badRequest(
          "You must provide a valid wordsCount in the query parameters."
        );
      }

      const { results } = await strapi.service("api::word.word").find({
        fields: ["id", "name"],
        filters: {
          categories: {
            slug: {
              $in: categoriesArray,
            },
          },
        },
        populate: {
          categories: {
            fields: ["id"],
          },
        },
        sort: ["updatedAt:asc"],
        pagination: {
          pageSize: Number(wordsCount),
        },
      });

      console.log("getWordsForGame results", { results });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedResults);
    },
  })
);
