const config = require("config");
const jwt = require("jsonwebtoken");

const getUserToken = require("./getUserToken");

describe("getUserToken", () => {
  const { token } = getUserToken();
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  test("if token payload contains the correct data", () => {
    expect(Object.keys(decoded)).toEqual(
      expect.arrayContaining(["_id", "role"])
    );
  });

  test("if token payload contains user role", () => {
    expect(decoded.role).toBe("User");
  });
});
