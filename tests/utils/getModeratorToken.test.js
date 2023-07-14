const getModeratorToken = require("./getModeratorToken");
const decodeToken = require("../../utils/decodeToken");

describe("getModeratorToken", () => {
  const { token } = getModeratorToken();
  const decoded = decodeToken(token);

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
