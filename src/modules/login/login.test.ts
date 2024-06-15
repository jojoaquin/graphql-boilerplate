import { User } from "./../../entity/User";
import { url } from "./../../../tests/constant";
import request from "graphql-request";
import { createTypeOrmConn } from "./../../utils/createTypeOrmConn";

beforeAll(async () => {
  await createTypeOrmConn();
});

const email = "tom@bob.com";
const password = "jalksdf";

const register = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const login = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("login", () => {
  it("should login with invalid email", async () => {
    const response: any = await request(url, login("adawa", password));
    expect(response.login[0].path).toEqual("email");
  });

  it("should login with please confirm your email", async () => {
    await request(url, register(email, password));
    const response2: any = await request(url, login(email, password));
    expect(response2.login[0].path).toEqual("email");
  });

  it("should login with invalid pass", async () => {
    await request(url, register(email, password));
    await User.update(
      {
        email,
      },
      {
        confirmed: true,
      }
    );
    const response2: any = await request(url, login(email, "adwa"));
    expect(response2.login[0].path).toEqual("email");
  });

  it("should success login", async () => {
    await request(url, register(email, password));
    await User.update(
      {
        email,
      },
      {
        confirmed: true,
      }
    );
    const response2: any = await request(url, login(email, password));
    expect(response2.login).toBeNull();
  });
});
