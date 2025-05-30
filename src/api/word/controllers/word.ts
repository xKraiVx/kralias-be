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

      const wordsByCategories = await Promise.all(
        categoriesArray.map(async (category) => {
          const { results } = await strapi.service("api::word.word").find({
            fields: ["id", "name"],
            filters: {
              categories: {
                slug: {
                  $eq: category,
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

          return results;
        })
      );

      let wordsFromArray = Math.floor(wordsCount / categoriesArray.length);

      const chosenWords = wordsByCategories.reduce((acc, words, idx) => {
        if (acc.length >= wordsCount) {
          return acc;
        }

        if (idx === wordsByCategories.length - 1) {
          wordsFromArray = wordsCount - acc.length;
        }

        const randomWords = words
          .sort(() => 0.5 - Math.random())
          .slice(0, wordsFromArray);
        acc.push(...randomWords);

        return acc;
      }, []);

      const sanitizedResults = await this.sanitizeOutput(chosenWords, ctx);

      return this.transformResponse(sanitizedResults);
    },
  })
);
