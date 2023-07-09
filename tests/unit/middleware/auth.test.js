const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const callMockedMiddleware = require("./utils/callMockedMiddleware");

describe("auth", () => {
  test("if token is not provided, it will return 401", () => {
    const { responseStatus } = callMockedMiddleware();

    expect(responseStatus).toEqual(401);
  });
  test("if token invalid, it will return 400", () => {
    const token = "1234";
    const { responseStatus } = callMockedMiddleware(token);

    expect(responseStatus).toEqual(400);
  });

  test("if token valid, it will return defined req.user._id", () => {
    const { token, objectId } = getUserToken();
    const { req } = callMockedMiddleware(token);

    expect(req.user._id).toEqual(objectId);
  });

  test("if token valid, it will return defined req.user.role", () => {
    const { token } = getUserToken();
    const { req } = callMockedMiddleware(token);

    expect(req.user.role).toEqual("User");
  });

  test("if token is valid, next() will be run", () => {
    const { token } = getUserToken();
    const { next } = callMockedMiddleware(token);

    expect(next).toHaveBeenCalled();
  });

  test("if token is admin, next() will be run", () => {
    const { token } = getAdminToken();
    const { next } = callMockedMiddleware(token);

    expect(next).toHaveBeenCalled();
  });
});
