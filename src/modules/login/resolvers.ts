import { userSessionIdPrefix } from "./../../constant";
import { MutationLoginArgs } from "./../../types/generated.d";
import { User } from "./../../entity/User";
import { ResolverMap } from "./../../types/graphql-utils.d";
import bcrypt from "bcrypt";

const errorResponse = [
  {
    path: "email",
    message: "invalid login",
  },
];

const resolvers: ResolverMap = {
  Mutation: {
    login: async (_, args: MutationLoginArgs, { session, redis }) => {
      const { email, password } = args;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: "please confirm your email",
          },
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      session.userId = user.id;
      await redis.set(`${userSessionIdPrefix}${user.id}`, user.id);

      return null;
    },
  },
};

export default resolvers;
