import { request } from "graphql-request";

import { User } from "../entity/User";
import { startServer } from "../services/server";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();
  const {port} = app.address() as {address: string, port: number, family: string};
  getHost = () => `http://127.0.0.1:${port}/graphql`;
})

const email = "bob4@bob.com";
const password = "[paswrasra]";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
  console.log(getHost())
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
});
