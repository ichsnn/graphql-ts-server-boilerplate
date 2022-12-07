import * as express from "express";
import { createSchema, createYoga } from "graphql-yoga";
import Redis from "ioredis";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { AppDataSource } from "./data-source";
import * as path from "path";
import { User } from "../entity/User";

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

  const redis = new Redis();
  const yoga = createYoga({
    schema: (_) => schema,
    context: ({ request }) => {      
      const protocol = request.url.split(":")[0];
      const host = request.headers.get("host");
      return { redis, url: `${protocol}://${host}` };
    },
  });
  const app = express();
  app.use('/graphql', yoga);
  AppDataSource.initialize();

  app.get("/confirmation/:id", async (req, res) => {
    const confirmation_id = req.params.id;
    const userId = await redis.get(confirmation_id);
    if(userId) {
      await User.update({ id: userId! }, { confirmed: true });
      res.send("ok")
    }
    else {
      res.status(404).send("invalid");
    }
  })

  const listener = app.listen(
    { port: String(process.env.NODE_ENV).trim() === "test" ? 0 : 4000 },
    () => {
      console.info("Server is running on http://localhost:4000/graphql");
    }
  );

  app.on("close", () => {
    AppDataSource.destroy();
  });

  return listener;
};
