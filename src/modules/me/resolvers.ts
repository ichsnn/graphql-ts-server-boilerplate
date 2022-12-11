import { MeModule } from "./types";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: MeModule.Resolvers = {
  Query: {
    me: createMiddleware(middleware, (_, __) => {
      return null;
    }),
  },
};
