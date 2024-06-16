import throwCustomError from "./utils/throwCustomError";

export const isAuthMiddleware = {
  Query: {
    me: async (
      resolve: any,
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      if (!context.session.userId) {
        throwCustomError("Not Auth", "UNAUTHORIZED");
      }
      return resolve(parent, args, context, info);
    },
  },
};
