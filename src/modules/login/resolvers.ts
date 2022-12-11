import * as bcrypt from "bcrypt";
import { Redis } from "ioredis";

import { User } from "../../entity/User";
import { createErrorResponse } from "../../utils/createErrorResponse";
import { confirmEmailError, invalidLoginError } from "./errorMessages";
import { LoginModule } from "./types";

export const resolvers: LoginModule.Resolvers = {
  Query: {
    bye2: () => "bye",
  },
  Mutation: {
    login: async (_, { email, password }, { redis } : {redis : Redis}) =>
      // { redis, url }
      {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return [createErrorResponse("email", invalidLoginError)];
        }

        if (!user.confirmed) {
          return [createErrorResponse("email", confirmEmailError)];
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return [createErrorResponse("password", invalidLoginError)];
        }

        // redis session
        await redis.set(`session${user.id}`, user.id, "EX", 60 * 60 * 24); // 1 day

        return null;
      },
  },
};
