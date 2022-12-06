import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { AppDataSource } from "./data-source";
import * as path from "path";

export const startServer = async () => {
  const typeDefFiles = loadFilesSync(
    path.join(__dirname, "../modules/**/schema.graphql")
  );
  const resolverFiles = loadFilesSync(
    path.join(__dirname, "../modules/**/resolvers.ts")
  );
  const sharedTypeDefs = loadFilesSync(
    path.join(__dirname, "../shared.graphql")
  );
  typeDefFiles.push(...sharedTypeDefs);

  const typeDefs = mergeTypeDefs(typeDefFiles);
  const resolvers = mergeResolvers(resolverFiles);
  const schema = createSchema({ typeDefs, resolvers });

  const yoga = createYoga({ schema });
  const server = createServer(yoga);

  await AppDataSource.initialize();
  const app = server.listen(
    { port: String(process.env.NODE_ENV).trim() === "test" ? 0 : 4000 },
    () => {
      console.info("Server is running on http://localhost:4000/graphql");
    }
  );
  app.on("close", () => {
    AppDataSource.destroy();
  });
  return app;
};
