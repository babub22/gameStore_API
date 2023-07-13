const mongoose = require("mongoose");
const callMockedValidatorMiddleware = require("./utils/callMockedValidatorMiddleware");
const validateRequestBody = require("../../../middleware/validateRequestBody");

describe("validateRequestBody", () => {
  test("if provided parameters is invalid, it will return 400", () => {
    const requestParams = {
      body: { objectId: 1234567 },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestBody
    );

    const responseStatus = res.status.mock.calls[0]?.[0];

    expect(responseStatus).toEqual(400);
  });
  test("if provided parameters is invalid, it will return error message", () => {
    const requestParams = {
      body: { objectId: 1234567 },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestBody
    );

    const responseMessage = res.send.mock.calls[0]?.[0];

    expect(responseMessage).toMatch("must be one of");
  });
  test("if provided parameters is valid, next() will be run", () => {
    const requestParams = {
      body: { objectId: new mongoose.Types.ObjectId().toHexString() },
    };

    const { next } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestBody
    );

    expect(next).toHaveBeenCalled();
  });
});
