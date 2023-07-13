const getModeratorToken = require("../../utils/getModeratorToken");
const moderator = require("../../../middleware/moderator");
const callMockedMiddleware = require("./utils/callMockedMiddleware");
const getUserToken = require("../../utils/getUserToken");

describe("moderator", () => {
  test("if provided user is not admin, it will return 403", () => {
    const { token } = getModeratorToken();
    const { responseStatus } = callMockedMiddleware(token, moderator);

    expect(responseStatus).toEqual(403);
  });
  test("if provided user is not moderator, it will return 403", () => {
    const { token } = getModeratorToken();
    const { responseStatus } = callMockedMiddleware(token, moderator);

    expect(responseStatus).toEqual(403);
  });
  test("if provided user is moderator, next() will be run", () => {
    const { token } = getModeratorToken();
    const { next } = callMockedMiddleware(token, moderator);

    expect(next).toHaveBeenCalled();
  });
  test("if provided user is admin, next() will be run", () => {
    const { token } = getModeratorToken();
    const { next } = callMockedMiddleware(token, moderator);

    expect(next).toHaveBeenCalled();
  });
  test("if provided user have user role, next() will be run", () => {
    const { token } = getUserToken();
    const { next } = callMockedMiddleware(token, moderator);

    expect(next).toHaveBeenCalled();
  });
});
