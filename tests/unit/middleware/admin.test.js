const admin = require("../../../middleware/admin");
const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const callMockedMiddleware = require("./utils/callMockedMiddleware");
const getHeaderObject = require("./utils/getHeaderObject");

describe("admin", () => {
  test("if provided user is not admin, it will return 403", () => {
    const { token } = getUserToken();
    const headerObject = getHeaderObject(token);
    const { responseStatus } = callMockedMiddleware(headerObject, admin);

    expect(responseStatus).toEqual(403);
  });
  test("if provided user is admin, next() will be run", () => {
    const { token } = getAdminToken();
    const headerObject = getHeaderObject(token);
    const { next } = callMockedMiddleware(headerObject, admin);

    expect(next).toHaveBeenCalled();
  });
});
