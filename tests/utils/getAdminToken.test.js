const config = require("config");
const jwt = require("jsonwebtoken");

const getAdminToken = require("./getAdminToken");

describe("getAdminToken", () => {
  const { token } = getAdminToken();
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  test("if token payload contains the correct data", () => {
    expect(Object.keys(decoded)).toEqual(
      expect.arrayContaining(["_id", "role"])
    );
  });

  test("if token payload contains admin role", () => {
    expect(decoded.role).toBe("Admin");
  });
});
