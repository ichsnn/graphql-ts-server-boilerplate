import * as bcrypt from "bcrypt";

import { User } from "../../entity/User";
import { createErrorResponse } from "../../utils/createErrorResponse";
import { confirmEmailError, invalidLoginError } from "./errorMessages";
import { LoginModule } from "./types";

export const resolvers: LoginModule.Resolvers = {
  Query: {
    bye2: () => "bye",
  },
  Mutation: {
    login: async (_, { email, password }, { body }) =>
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

        // login successful
        body.session.userId = user.id;

        return null;
      },
  },
};
