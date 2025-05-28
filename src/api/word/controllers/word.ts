/**
 * word controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::word.word",
  ({ strapi }) => ({
    async getWordsForGame(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      const { results } = await strapi.service("api::word.word").find({
        fields: ["id", "name"],
        populate: {
          categories: {
            fields: ["id"],
          },
        },
        ...sanitizedQueryParams,
      });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedResults);
    },
  })
);
