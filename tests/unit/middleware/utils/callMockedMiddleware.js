const auth = require("../../../../middleware/auth");
const getMiddlewareParams = require("./getMiddlewareParams");

function callMockedMiddleware(token, middleware) {
  const { req, res, next } = getMiddlewareParams(token);

  auth(req, res, next);
  middleware?.(req, res, next);

  const responseStatus = res.status.mock.calls[0]?.[0];

  return { req, next, responseStatus };
}

module.exports = callMockedMiddleware;
