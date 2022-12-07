import * as express from "express";
import { createYoga } from "graphql-yoga";
import { AppDataSource } from "./data-source";
import { redis } from "./redis";
import routes from "../routes";
import { generateSchema } from "../utils";

export const startServer = async () => {
  // GraphQL Yoga
  const schema = generateSchema();
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
  app.use(routes);

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
