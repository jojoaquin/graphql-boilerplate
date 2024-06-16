import { ResolverMap } from "./../../types/graphql-utils.d";

const resolvers: ResolverMap = {
  Mutation: {
    logout: (_, __, { session }) => {
      session.destroy((err) => {
        console.log(err);
      });
      return true;
    },
  },
};

export default resolvers;
