import bcrypt from "bcrypt";
import { User } from "../../entity/User";
import { url } from "../../../tests/constant";
import { createTypeOrmConn } from "../../utils/createTypeOrmConn";
import axios from "axios";

const email = "tom@bob.com";
const password = "jalksdf";

beforeAll(async () => {
  await createTypeOrmConn();
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    email,
    password: hashedPassword,
    confirmed: true,
  }).save();
});

const login = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const logout = `
mutation Mutation {
  logout
}
  `;

describe("me test", () => {
  it("should return null if no cookie", async () => {
    const response = await axios.post(url, {
      query: logout,
    });
    expect(response.data.data).toBeNull();
  });

  it("should logout true", async () => {
    const loginResponse = await axios.post(url, {
      query: login(email, password),
    });
    const cookie = loginResponse.headers["set-cookie"];

    const response = await axios.post(
      url,
      {
        query: logout,
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    expect(response.data.data.logout).toBeTruthy;
  });
});
