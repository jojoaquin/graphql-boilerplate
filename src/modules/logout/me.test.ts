import bcrypt from "bcrypt";
import { User } from "./../../entity/User";
import { url } from "./../../../tests/constant";
import { createTypeOrmConn } from "./../../utils/createTypeOrmConn";
import axios from "axios";

const email = "tom@bob.com";
const password = "jalksdf";
let userId = "";

beforeAll(async () => {
  await createTypeOrmConn();
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashedPassword,
    confirmed: true,
  }).save();
  userId = user.id;
});

const login = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const meQuery = `
query Me {
  me {
    id
    email
  }
}
`;

describe("me test", () => {
  it("should return null if no cookie", async () => {
    const response = await axios.post(url, {
      query: meQuery,
    });
    expect(response.data.data.me).toBeNull();
  });

  it("should return user if have cookie", async () => {
    const response2 = await axios.post(
      url,
      {
        query: login(email, password),
      },
      {
        withCredentials: true,
      }
    );

    const cookies = response2.headers["set-cookie"];

    const response = await axios.post(
      url,
      {
        query: meQuery,
      },
      {
        headers: {
          Cookie: cookies,
        },
        withCredentials: true,
      }
    );

    expect(response.data.data.me).toEqual({
      id: userId,
      email,
    });
  });
});
