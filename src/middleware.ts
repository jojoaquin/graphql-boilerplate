import { listLoginUserKey, userSessionIdPrefix } from "./constant";
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

  let found: string | undefined;
  await context.redis.lrange(listLoginUserKey, 0, -1, async (err, res) => {
    if (err) console.log("err range middleware: " + err);

    if (res) {
      found = res.find((value) => {
        return value === `${userSessionIdPrefix}${context.session.userId}`;
      });
    }
  });

  if (!found) {
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
