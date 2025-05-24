/**
 * category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    async getCategoriesForGame(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const { results, pagination } = await strapi
        .service("api::category.category")
        .find({
          fields: ["slug", "id", "name"],
          populate: {
            words: {
              fields: ["id"],
            },
          },
          ...sanitizedQueryParams,
        });

      const formattedResults = results.map(({ id, slug, name, words }) => ({
        id,
        slug,
        name,
        hasWords: !!words.length,
      }));

      const sanitizedResults = await this.sanitizeOutput(formattedResults, ctx);

      return this.transformResponse(sanitizedResults, { pagination });
    },
  })
);
