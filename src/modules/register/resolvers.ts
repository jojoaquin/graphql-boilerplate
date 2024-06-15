// import { sendEmail } from "./../../utils/sendEmail";
// import { createConfirmEmailLink } from "./../../utils/createConfirmEmailLink";
import { MutationRegisterArgs } from "./../../types/generated";
import { formatZodError } from "./../../utils/formatZodError";
import { z } from "zod";
import { User } from "./../../entity/User";
import { ResolverMap } from "./../../types/graphql-utils.d";
import bcrypt from "bcrypt";

const schema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(3).max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _,
      args: MutationRegisterArgs
      // , { redis, url }
    ) => {
      try {
        schema.parse(args);
      } catch (err) {
        return formatZodError(err);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: {
          email,
        },
        select: ["id"],
      });

      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: "already taken",
          },
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();

      // if (process.env.NODE_ENV !== "test") {
      //   const urlConfirmEmail = await createConfirmEmailLink(
      //     url,
      //     user.id,
      //     redis
      //   );

      //   await sendEmail(user.email, urlConfirmEmail);
      // }

      return null;
    },
  },
};

export default resolvers;
