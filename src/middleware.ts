import { QueryMeArgs } from "./types/generated.d";
export const middleware = async (
  resolve: any,
  root: any,
  args: QueryMeArgs,
  context: any,
  info: any
) => {
  if (!context.userId) {
    throw new Error("not auth");
  }
  return resolve(root, args, context, info);
};
