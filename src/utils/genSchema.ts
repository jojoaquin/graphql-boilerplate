import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";

export const genSchema = () => {
  const typesArray = loadFilesSync(
    path.join(__dirname, "../modules/**/*.graphql")
  );
  const resolversArray = loadFilesSync(
    path.join(__dirname, "../modules/**/resolvers.ts")
  );

  const typeDefs = mergeTypeDefs(typesArray);
  const resolvers = mergeResolvers(resolversArray);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  return schema;
};
