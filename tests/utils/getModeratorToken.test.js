const config = require("config");
const jwt = require("jsonwebtoken");
const getModeratorToken = require("./getModeratorToken");

describe("getUserToken", () => {
  const { token } = getModeratorToken();
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

  test("if token payload contains the correct data", () => {
    expect(Object.keys(decoded)).toEqual(
      expect.arrayContaining(["_id", "role", "name", "isReviewer"])
    );
  });

  test("if token payload contains moderator role", () => {
    expect(decoded.role).toBe("Moderator");
  });

  test("if token payload contains name Vlad", () => {
    expect(decoded.name).toBe("Vlad");
  });
});
