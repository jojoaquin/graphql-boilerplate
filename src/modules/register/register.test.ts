import { createTypeOrmConn } from "./../../utils/createTypeOrmConn";
import { url } from "../../../tests/constant";
import { User } from "../../entity/User";
import request from "graphql-request";

const email = "tom@bob.com";
const password = "jalksdf";

beforeAll(async () => {
  await createTypeOrmConn();
});

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("Register user", () => {
  it("check for duplicate emails", async () => {
    const response = await request(url, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2: any = await request(url, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0].path).toEqual("email");
  });

  it("should check bad email", async () => {
    const response3: any = await request(url, mutation("adwa", password));
    expect(response3.register).toHaveLength(1);
    expect(response3.register[0].path).toEqual("email");
  });

  it("should check bad pass", async () => {
    const response4: any = await request(url, mutation(email, "ad"));
    expect(response4.register).toHaveLength(1);
    expect(response4.register[0].path).toEqual("password");
  });

  it("should check bad email and pass", async () => {
    const response5: any = await request(url, mutation("a", "ad"));
    expect(response5.register).toHaveLength(3);
  });
});
