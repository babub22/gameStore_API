const objectIdValidator = require("../../../../utils/validators/objectIdValidator");
const getMiddlewareParams = require("./getMiddlewareParams");

function callMockedValidatorMiddleware(requestParams, validatorMiddleware) {
  const { req, res, next } = getMiddlewareParams(requestParams);

  const middleware = validatorMiddleware(objectIdValidator);
  middleware(req, res, next);

  return { res, next };
}

module.exports = callMockedValidatorMiddleware;
