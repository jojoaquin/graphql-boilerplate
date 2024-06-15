import axios from "axios";

it("should send invalid", async () => {
  const res = await axios.get(`http://localhost:4001/confirm/12312`);
  expect(res.data).toBe("invalid");
});
