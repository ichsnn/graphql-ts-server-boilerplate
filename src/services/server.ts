import * as express from "express";
import { createSchema, createYoga } from "graphql-yoga";
import Redis from "ioredis";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { AppDataSource } from "./data-source";
import * as path from "path";
import { User } from "../entity/User";

export const startServer = async () => {
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

  // Redis
  const redis = new Redis();

  // GraphQL Yoga
  const yoga = createYoga({
    schema: (_) => schema,
    context: ({ request }) => {
      const protocol = request.url.split(":")[0];
      const host = request.headers.get("host");
      return { redis, url: `${protocol}://${host}` };
    },
  });

  // Express Server
  const app = express();
  app.use("/graphql", yoga);
  app.get("/confirmation/:id", async (req, res) => {
    const key_id = req.params.id;
    const userId = await redis.get(key_id);
    if (userId) {
      await User.update({ id: userId! }, { confirmed: true });
      await redis.del(key_id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  });

  // Initialize Data Source
  await AppDataSource.initialize();
  const listener = app.listen(
    { port: String(process.env.NODE_ENV).trim() === "test" ? 0 : 4000 },
    () => {
      console.info("Server is running on http://localhost:4000/graphql");
    }
  );

  return listener;
};
