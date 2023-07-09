const admin = require("../../../middleware/admin");
const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const callMockedMiddleware = require("./utils/callMockedMiddleware");

describe("admin", () => {
  test("if provided user is not admin, it will return 403", () => {
    const { token } = getUserToken();
    const { responseStatus } = callMockedMiddleware(token, admin);

    expect(responseStatus).toEqual(403);
  });
  test("if provided user is admin, next() will be run", () => {
    const { token } = getAdminToken();
    const { next } = callMockedMiddleware(token, admin);

    expect(next).toHaveBeenCalled();
  });
});
