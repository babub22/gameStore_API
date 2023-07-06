const admin = require("../../../middleware/admin");
const getAdminToken = require("../../utils/getAdminToken");
const getUserToken = require("../../utils/getUserToken");
const auth = require("../../../middleware/auth");
const getMiddlewareParams = require("./utils/getMiddlewareParams");

describe("admin", () => {
  test("if provided user is not admin, it will return 403", () => {
    const { token } = getUserToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);
    admin(req, res, next);

    const responseStatus = res.status.mock.calls[0][0];
    expect(responseStatus).toEqual(403);
  });
  test("if provided user is admin, next() will be run", () => {
    const { token } = getAdminToken();
    const { req, res, next } = getMiddlewareParams(token);

    auth(req, res, next);
    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
