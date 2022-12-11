import { request } from "graphql-request";
import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { AppDataSource, redis } from "../../services";
import { Error } from "../../types";
import { createErrorResponse } from "../../utils/createErrorResponse";
import { confirmEmailError, invalidLoginError } from "./errorMessages";

const email = "user@mail.com";
const password = "password@mail.com";

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const registerMutation = (e: string, p: string) => `
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
  redis.quit();
  await conn.destroy();
});

describe("Login", () => {
  // set host
  let host = `${process.env.TEST_HOST}/graphql` as string;
  // login test function
  const loginExpectError = async (
    e: string,
    p: string,
    errorResponse: Error[]
  ) => {
    const response = await request(host, loginMutation(e, p));
    expect(response).toEqual({
      login: errorResponse,
    });
  };

  test("Email not found send back error", async () => {
    await loginExpectError("bob@mail.com", "password", [
      createErrorResponse("email", invalidLoginError),
    ]);
  });

  test("Test Login to Be", async () => {
    await request(host, registerMutation(email, password));
    await loginExpectError(email, password, [
      createErrorResponse("email", confirmEmailError),
    ]);

    await User.update({ email }, { confirmed: true });
    await loginExpectError(email, "Hello", [
      createErrorResponse("password", invalidLoginError),
    ]);

    const response = await request(host, loginMutation(email, password));
    expect(response).toEqual({ login: null });
  });
});
