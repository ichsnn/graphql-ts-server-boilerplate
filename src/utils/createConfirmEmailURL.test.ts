import axios from "axios";
import { redis } from "../services";
import { User } from "../entity/User";
import { AppDataSource } from "../services/data-source";
import { createConfirmEmailURL } from "./createConfirmEmailURL";

let userId: string;

beforeAll(async () => {
  await AppDataSource.initialize();
  const user = await User.create({
    email: "john@doe.com",
    password: "password",
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await AppDataSource.destroy();
  await redis.flushall();
  redis.disconnect();
});

let url: string;
// Validate the URL
test("Make sure it confirms a user", async () => {
  url = await createConfirmEmailURL(
    process.env.TEST_HOST as string,
    userId,
    redis
  );

  const response = await axios(url);
  const text = response.data;
  expect(text).toEqual("ok");
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const keyValue = await redis.get(key);
  expect(keyValue).toBeNull();
});
