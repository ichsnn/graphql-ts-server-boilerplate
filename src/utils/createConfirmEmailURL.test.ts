import axios from "axios";
import Redis from "ioredis";
import { User } from "../entity/User";
import { AppDataSource } from "../services/data-source";
import { createConfirmEmailURL } from "./createConfirmEmailURL";

let userId: string;
let redis: Redis;

beforeAll(async () => {
  await AppDataSource.initialize();
  redis = new Redis();
  const user = await User.create({
    email: "john@doe.com",
    password: "password",
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await AppDataSource.destroy();
  redis.disconnect();
});

describe("Confirm Email URL", () => {
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
  });

  // Validate the user is confirmed
  test("Make sure the user is confirmed", async () => {
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
  });

  // Validate the key is removed from redis
  test("Make sure the key is removed from redis", async () => {
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const keyValue = await redis.get(key);
    expect(keyValue).toBeNull();
  });

  // Invalidate the URL
  test("Send invalid back if bad id sent", async () => {
    const response = await axios(`${process.env.TEST_HOST}/confirmation/1234`);
    const text = response.data;
    expect(text).toEqual("invalid");
  });
});
