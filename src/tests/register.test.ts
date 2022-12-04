import { request } from "graphql-request";
import { User } from "../entity/User";
import { AppDataSource } from "../services/data-source";
import { host } from "./constants";

beforeAll(async () => {
  await AppDataSource.initialize();
})

const email = "bob3@bob.com";
const password = "paswrasra";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
});

// use a test database
// drop all data once the test is done
// when I run npm test it also starts the server
