const auth = require("../../../middleware/auth");
const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const getMiddlewareParams = require("./utils/getMiddlewareParams");

describe("auth", () => {
  test("if token is not provided, it will return 401", () => {
    const { req, res, next } = getMiddlewareParams();

    auth(req, res, next);

    const responseStatus = res.status.mock.calls[0][0];
    expect(responseStatus).toEqual(401);
  });
  test("if token invalid, it will return 400", () => {
    const token = "1234";
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);

    const responseStatus = res.status.mock.calls[0][0];
    expect(responseStatus).toEqual(400);
  });

  test("if token valid, it will return defined req.user._id", () => {
    const { token, objectId } = getUserToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);

    expect(req.user._id).toEqual(objectId);
  });

  test("if token valid, it will return defined req.user.role", () => {
    const { token } = getUserToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);

    expect(req.user.role).toEqual("User");
  });

  test("if token is valid, next() will be run", () => {
    const { token } = getUserToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("if token is admin, next() will be run", () => {
    const { token } = getAdminToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
