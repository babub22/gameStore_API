const getModeratorToken = require("../../utils/getModeratorToken");
const moderator = require("../../../middleware/moderator");
const callMockedMiddleware = require("./utils/callMockedMiddleware");
const getUserToken = require("../../utils/getUserToken");
const getHeaderObject = require("./utils/getHeaderObject");
const getAdminToken = require("../../utils/getAdminToken");

describe("moderator", () => {
  test("if provided user is not moderator/admin, it will return 403", () => {
    const { token } = getUserToken();

    const headerObject = getHeaderObject(token);
    const { responseStatus } = callMockedMiddleware(headerObject, moderator);

    expect(responseStatus).toEqual(403);
  });
  test("if provided user is moderator, next() will be run", () => {
    const { token } = getModeratorToken();

    const headerObject = getHeaderObject(token);
    const { next } = callMockedMiddleware(headerObject, moderator);

    expect(next).toHaveBeenCalled();
  });
  test("if provided user is admin, next() will be run", () => {
    const { token } = getAdminToken();

    const headerObject = getHeaderObject(token);
    const { next } = callMockedMiddleware(headerObject, moderator);

    expect(next).toHaveBeenCalled();
  });
});
