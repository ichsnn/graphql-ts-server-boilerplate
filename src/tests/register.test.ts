import { request } from "graphql-request";

import { User } from "../entity/User";
import { startServer } from "../services/server";

let getHost = () => "";
let app : any

beforeAll(async () => {
  app = await startServer();
  const {port} = app.address() as {address: string, port: number, family: string};
  getHost = () => `http://127.0.0.1:${port}/graphql`;
})

afterAll(async () => {
  app.close();
})

const email = "bob4@bob.com";
const password = "[paswrasra]";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
});
