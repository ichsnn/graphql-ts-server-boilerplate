import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import {
  errorDuplicateEmail,
  errorEmailNotLongEnough,
  errorInvalidEmail,
  errorPasswordNotLongEnough,
} from "./errorMessages";
import { RegisterModule } from "./types";

// import { createConfirmEmailURL } from "../../utils/createConfirmEmailURL";
// import { sendEmail } from "../../utils/sendEmail";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, errorEmailNotLongEnough)
    .max(255)
    .email(errorInvalidEmail),
  password: yup.string().min(3, errorPasswordNotLongEnough).max(255),
});

export const resolvers: RegisterModule.Resolvers = {
  Mutation: {
    register: async (
      _,
      args
      // { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      const { email, password } = args;

      const userExists: User | null = await User.findOne({
        where: { email },
        select: ["id"],
      });

      if (userExists) {
        return [
          {
            path: "email",
            message: errorDuplicateEmail,
          },
        ];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();

      // const link = await createConfirmEmailURL(url, user.id, redis);
      // sendEmail(email, link);

      return null;
    },
  },
};
