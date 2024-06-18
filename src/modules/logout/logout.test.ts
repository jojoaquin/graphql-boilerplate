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

const meQuery = `
query Me {
  me {
    id
    email
  }
}
`;

describe("logout test", () => {
  it("should return null if no cookie", async () => {
    const response = await axios.post(url, {
      query: logout,
    });
    expect(response.data.data).toBeNull();
  });

  it("multiple session", async () => {
    const sess1 = await axios.post(url, {
      query: login(email, password),
    });
    const sess2 = await axios.post(url, {
      query: login(email, password),
    });
    const cookie = sess1.headers["set-cookie"];
    const cookie2 = sess2.headers["set-cookie"];

    const response = await axios.post(
      url,
      {
        query: meQuery,
      },
      {
        headers: {
          Cookie: cookie,
        },
        withCredentials: true,
      }
    );

    const response2 = await axios.post(
      url,
      {
        query: meQuery,
      },
      {
        headers: {
          Cookie: cookie2,
        },
        withCredentials: true,
      }
    );

    expect(response.data).toEqual(response2.data);

    await axios.post(
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

    const response3 = await axios.post(
      url,
      {
        query: meQuery,
      },
      {
        headers: {
          Cookie: cookie,
        },
        withCredentials: true,
      }
    );

    const response4 = await axios.post(
      url,
      {
        query: meQuery,
      },
      {
        headers: {
          Cookie: cookie2,
        },
        withCredentials: true,
      }
    );

    expect(response3.data.data.me).toEqual(response4.data.data.me);
  });

  it("single session", async () => {
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
