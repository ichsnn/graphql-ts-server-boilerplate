import * as bcrypt from "bcrypt";
import { User } from "./entity/User";
import { Resolvers } from "./types/schema";

export const resolvers: Resolvers = {
  Query: {
    hello: (_: any, { name }) => `Hello ${name || "World"}`,
  },
  Mutation: {
    register: async (_: any, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();
      return true;
    },
  },
};
