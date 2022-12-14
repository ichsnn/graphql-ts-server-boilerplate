import { request } from "graphql-request";
import { DataSource } from "typeorm";

import { User } from "../../entity/User";
import { AppDataSource } from "../../services/data-source";
import {
  errorDuplicateEmail,
  errorEmailNotLongEnough,
  errorInvalidEmail,
  errorPasswordNotLongEnough,
} from "./errorMessages";

const email = "user@mail.com";
const password = "password";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

let conn: DataSource;

beforeAll(async () => {
  conn = await AppDataSource.initialize();
});

afterAll(async () => {
  await conn.destroy();
});

describe("Register user", () => {
  // set host
  let host = `${process.env.TEST_HOST}/graphql` as string;

  it("Check for duplicate email", async () => {
    // make sure we can register user
    const response1 = await request(host, mutation(email, password));
    expect(response1).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test duplicate email
    const response2 = await request(host, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: errorDuplicateEmail,
    });
  });

  it("Check bad email", async () => {
    // catch bad email
    const response3 = await request(host, mutation("ac", password));
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: errorEmailNotLongEnough,
        },
        {
          path: "email",
          message: errorInvalidEmail,
        },
      ],
    });
  });

  it("Check bad password", async () => {
    // catch bad password
    const response4 = await request(host, mutation(email, "a"));
    expect(response4.register[0]).toEqual({
      path: "password",
      message: errorPasswordNotLongEnough,
    });
  });

  it("Check bad email and bad password", async () => {
    // catch bad email and bad password
    const response5 = await request(host, mutation("a", "a"));
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: errorEmailNotLongEnough,
        },
        {
          path: "email",
          message: errorInvalidEmail,
        },
        {
          path: "password",
          message: errorPasswordNotLongEnough,
        },
      ],
    });
  });
});
