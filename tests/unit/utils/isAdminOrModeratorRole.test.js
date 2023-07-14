const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const getModeratorToken = require("../../utils/getModeratorToken");
const isAdminOrModeratorRole = require("../../../utils/isAdminOrModeratorRole");
const decodeToken = require("../../../utils/decodeToken");

describe("isAdminOrModeratorRole", () => {
  describe("if user role", () => {
    test("is Admin, it will return true", () => {
      const { token } = getAdminToken();
      const decoded = decodeToken(token);

      const result = isAdminOrModeratorRole(decoded.role);
      expect(result).toBe(true);
    });
    test("is Moderator, it will return true", () => {
      const { token } = getModeratorToken();
      const decoded = decodeToken(token);

      const result = isAdminOrModeratorRole(decoded.role);
      expect(result).toBe(true);
    });
    test("is User, it will return false", () => {
      const { token } = getUserToken();
      const decoded = decodeToken(token);

      const result = isAdminOrModeratorRole(decoded.role);
      expect(result).toBe(false);
    });
  });
});
