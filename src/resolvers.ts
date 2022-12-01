import { Resolvers } from "./types/schema";

export const resolvers: Resolvers = {
  Query: {
    hello: (_: any, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (_: any, {}) => true,
  },
};
