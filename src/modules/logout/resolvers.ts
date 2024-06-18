// import { userSessionIdPrefix } from "./../../constant";
import { ResolverMap } from "./../../types/graphql-utils.d";

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (
      _,
      __,
      {
        session,
        // redis
      }
    ) => {
      // await redis.del(`${userSessionIdPrefix}${session.userId}`);
      session.destroy((_err) => _err);
      return true;
    },
  },
};

export default resolvers;
