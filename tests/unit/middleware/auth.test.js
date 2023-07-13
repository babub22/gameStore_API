const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const callMockedMiddleware = require("./utils/callMockedMiddleware");
const getHeaderObject = require("./utils/getHeaderObject");

describe("auth", () => {
  test("if token is not provided, it will return 401", () => {
    const { responseStatus } = callMockedMiddleware({ header: jest.fn() });

    expect(responseStatus).toEqual(401);
  });
  test("if token invalid, it will return 400", () => {
    const token = "1234";

    const headerObject = getHeaderObject(token);
    const { responseStatus } = callMockedMiddleware(headerObject);

    expect(responseStatus).toEqual(400);
  });

  test("if token valid, it will return defined req.user._id", () => {
    const { token, objectId } = getUserToken();

    const headerObject = getHeaderObject(token);
    const { req } = callMockedMiddleware(headerObject);

    expect(req.user._id).toEqual(objectId);
  });

  test("if token valid, it will return defined req.user.role", () => {
    const { token } = getUserToken();

    const headerObject = getHeaderObject(token);
    const { req } = callMockedMiddleware(headerObject);

    expect(req.user.role).toEqual("User");
  });

  test("if token is valid, next() will be run", () => {
    const { token } = getUserToken();

    const headerObject = getHeaderObject(token);
    const { next } = callMockedMiddleware(headerObject);

    expect(next).toHaveBeenCalled();
  });

  test("if token is admin, next() will be run", () => {
    const { token } = getAdminToken();

    const headerObject = getHeaderObject(token);
    const { next } = callMockedMiddleware(headerObject);

    expect(next).toHaveBeenCalled();
  });
});
