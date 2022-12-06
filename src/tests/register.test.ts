import { request } from "graphql-request";

import { User } from "../entity/User";
import { startServer } from "../services/server";

let getHost = () => "";
let app: any;

beforeAll(async () => {
  app = await startServer();
  const { port } = app.address() as {
    address: string;
    port: number;
    family: string;
  };
  getHost = () => `http://127.0.0.1:${port}/graphql`;
});

afterAll(async () => {
  app.close();
});

const email = "bob4@bob.com";
const password = "[paswrasra]";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
  const response2 = await request(getHost(), mutation);
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0].path).toEqual("email");
  expect(response2.register[0].message).toEqual("Email already exists");
});
