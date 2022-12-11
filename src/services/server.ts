import * as express from "express";
import { createYoga } from "graphql-yoga";
import { AppDataSource } from "./data-source";
import { redis } from "./redis";
import routes from "../routes";
import { generateSchema } from "../utils";

import * as session from "express-session";
import * as cors from "cors";
import * as connectRedis from "connect-redis";

const SESSION_SECRET = "graphql-ts-server-boilerplate-secret";

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
    cors: {
      credentials: true,
      origin: "http://127.0.0.1:5500",
    },
  });

  let RedisStore = connectRedis(session);

  // Express Server
  const app = express();
  const corsConfig: cors.CorsOptions = {
    credentials: true,
    origin: "http://127.0.0.1:5500",
  };
  app.use(cors(corsConfig));
  app.options("*", cors(corsConfig));
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
  app.use("/graphql", (req, __, next) => {
    console.log(req.session);
    next();
  });

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
