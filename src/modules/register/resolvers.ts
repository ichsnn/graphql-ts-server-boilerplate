import * as bcrypt from "bcrypt";
import { User } from "../../entity/User";
import { RegisterModule } from "./types";

export const resolvers: RegisterModule.Resolvers = {
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
