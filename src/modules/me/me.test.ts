import axios from "axios";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { User } from "../../entity/User";
import { AppDataSource, redis } from "../../services";

const email = "hello@mail.com";
const password = "password";

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const meQuery = `
{
  me {
    id
    email
  }
}
`;

let conn: DataSource;

beforeAll(async () => {
  conn = await AppDataSource.initialize();
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hashedPassword,
    confirmed: true,
  }).save();
});

afterAll(async () => {
  redis.quit();
  await conn.destroy();
});

describe("Me", () => {
  const host = `${process.env.TEST_HOST}/graphql`;
  // test("can't get user if not logged in", async () => {
  //   // TODO
  // });

  test("get current user", async () => {
    await axios.post(
      host,
      {
        query: loginMutation(email, password),
      },
      {
        withCredentials: true,
      }
    );

    const response = await axios.post(
      host,
      {
        query: meQuery,
      }
    );

    console.log(response.data)
  });
});
