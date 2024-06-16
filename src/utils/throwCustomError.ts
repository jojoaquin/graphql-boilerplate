import { GraphQLError } from "graphql";
export default (message: string, code: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code,
      stacktrace: false,
    },
  });
};
