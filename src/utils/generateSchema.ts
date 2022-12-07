import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { createSchema } from "graphql-yoga";
import * as path from "path";

export const generateSchema = () => {
  // TypeDefs
  const typeDefFiles = loadFilesSync(
    path.join(__dirname, "../modules/**/schema.graphql")
  );
  const sharedTypeDefs = loadFilesSync(
    path.join(__dirname, "../shared.graphql")
  );
  typeDefFiles.push(...sharedTypeDefs);
  const typeDefs = mergeTypeDefs(typeDefFiles);
  // Resolvers
  const resolverFiles = loadFilesSync(
    path.join(__dirname, "../modules/**/resolvers.ts")
  );
  const resolvers = mergeResolvers(resolverFiles);
  // Schema
  const schema = createSchema({ typeDefs, resolvers });
  return schema;
}