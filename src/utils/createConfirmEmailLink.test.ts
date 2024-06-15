import { Redis } from "ioredis";
import { User } from "./../entity/User";
import { createTypeOrmConn } from "./createTypeOrmConn";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import axios from "axios";

let userId: string;
const host = "http://localhost:4001";
const redis = new Redis();

beforeAll(async () => {
  await createTypeOrmConn();
  const user = await User.create({
    email: "bob5@gmail.com",
    password: "awdadawdwa",
  }).save();
  userId = user.id;
});

it("Make sure create confirm email link work", async () => {
  const url = await createConfirmEmailLink(host, userId, redis);

  const res = await axios.get(url);
  const text = res.data;
  expect(text).toEqual("ok");

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  expect(user!.confirmed).toBeTruthy;
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
