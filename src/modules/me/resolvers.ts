import { QueryMeArgs } from "./../../types/generated.d";
import { ResolverMap } from "./../../types/graphql-utils.d";

const resolvers: ResolverMap = {
  Query: {
    me: (_, { name }: QueryMeArgs) => {
      return {
        name,
        error: null,
      };
    },
  },
};

export default resolvers;
