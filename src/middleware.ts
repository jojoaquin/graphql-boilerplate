import { userSessionIdPrefix } from "./constant";
import { Context } from "./types/graphql-utils.d";
import throwCustomError from "./utils/throwCustomError";

const isAuth = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  if (!context.session.userId) {
    throwCustomError("Not Auth", "UNAUTHORIZED");
  }

  const userId = await context.redis.get(
    `${userSessionIdPrefix}${context.session.userId}`
  );
  if (!userId) {
    throwCustomError("You have been logout, try to login", "UNAUTHORIZED");
  }

  return resolve(parent, args, context, info);
};

export const isAuthMiddleware = {
  Query: {
    me: isAuth,
  },
  Mutation: {
    logout: isAuth,
  },
};
