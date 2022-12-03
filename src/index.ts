import "reflect-metadata";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { resolvers } from "./resolvers";
import { AppDataSource } from "./data-source";
import path = require("node:path");

const schemaPath = path.join(__dirname, "schema.graphql");
const typeDefs = readFileSync(schemaPath, "utf-8");
const yoga = createYoga({ schema: createSchema({ typeDefs, resolvers }) });
const server = createServer(yoga);

AppDataSource.initialize()
  .then(() => {
    server.listen(4000, () => {
      console.info("Server is running on http://localhost:4000/graphql");
    });
  })
  .catch((error) => console.log(error));
