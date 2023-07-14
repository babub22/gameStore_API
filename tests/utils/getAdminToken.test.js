const getAdminToken = require("./getAdminToken");
const decodeToken = require("../../utils/decodeToken");

describe("getAdminToken", () => {
  const { token } = getAdminToken();
  const decoded = decodeToken(token);

  test("if token payload contains the correct data", () => {
    expect(Object.keys(decoded)).toEqual(
      expect.arrayContaining(["_id", "role", "name", "isReviewer"])
    );
  });

  test("if token payload contains admin role", () => {
    expect(decoded.role).toBe("Admin");
  });

  test("if token payload contains name Vlad", () => {
    expect(decoded.name).toBe("Vlad");
  });
});
