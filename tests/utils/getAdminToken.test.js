const config = require("config");
const jwt = require("jsonwebtoken");

const getAdminToken = require("./getAdminToken");

describe("getAdminToken", () => {
  const { token } = getAdminToken();
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  test("if token payload contains the correct data", () => {
    expect(Object.keys(decoded)).toEqual(
      expect.arrayContaining(["_id", "role", "name"])
    );
  });

  test("if token payload contains admin role", () => {
    expect(decoded.role).toBe("Admin");
  });

  test("if token payload contains name Vlad", () => {
    expect(decoded.name).toBe("Vlad");
  });
});
