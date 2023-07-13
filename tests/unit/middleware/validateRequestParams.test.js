const mongoose = require("mongoose");
const validateRequestParams = require("../../../middleware/validateRequestParams");
const callMockedValidatorMiddleware = require("./utils/callMockedValidatorMiddleware");

describe("getMiddlewareParams", () => {
  test("if provided parameters is invalid, it will return 400", () => {
    const requestParams = {
      params: { objectId: 1234567 },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestParams
    );

    const responseStatus = res.status.mock.calls[0]?.[0];

    expect(responseStatus).toEqual(400);
  });

  test("if provided parameters is invalid, it will return error message", () => {
    const requestParams = {
      params: { objectId: 1234567 },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestParams
    );

    const responseMessage = res.send.mock.calls[0]?.[0];

    expect(responseMessage).toMatch("must be one of");
  });

  test("if provided parameters is valid, next() will be run", () => {
    const requestParams = {
      params: { objectId: new mongoose.Types.ObjectId().toHexString() },
    };

    const { next } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestParams
    );

    expect(next).toHaveBeenCalled();
  });
});
