import { listLoginUserKey, userSessionIdPrefix } from "./../../constant";
import { ResolverMap } from "./../../types/graphql-utils.d";

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session, redis }) => {
      await redis.lrange(listLoginUserKey, 0, -1, async (err) => {
        if (err) {
          console.log("error logout: " + err);
        }
        await redis.lrem(
          listLoginUserKey,
          0,
          `${userSessionIdPrefix}${session.userId}`
        );
      });
      session.destroy((_err) => _err);
      return true;
    },
  },
};

export default resolvers;
