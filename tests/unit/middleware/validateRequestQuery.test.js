const callMockedValidatorMiddleware = require("./utils/callMockedValidatorMiddleware");
const validateRequestQuery = require("../../../middleware/validateRequestQuery");
const changeRoleQueryValidator = require("../../../utils/validators/user/changeRoleQueryValidator");

describe("getMiddlewareParams", () => {
  test("if provided query valid, it will reun next() function", () => {
    const requestParams = {
      query: { role: "Moderator" },
    };

    const { next } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestQuery,
      changeRoleQueryValidator
    );

    expect(next).toHaveBeenCalled();
  });

  test("if provided query has invalid key, it will return error message", () => {
    const requestParams = {
      query: { to: "Admin" },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestQuery,
      changeRoleQueryValidator
    );

    const responseMessage = res.send.mock.calls[0]?.[0];

    expect(responseMessage).toMatch('"role" is required');
  });

  test("if provided query has invalid value, it will return error", () => {
    const requestParams = {
      query: { role: "Super user" },
    };

    const { res } = callMockedValidatorMiddleware(
      requestParams,
      validateRequestQuery,
      changeRoleQueryValidator
    );

    const responseMessage = res.send.mock.calls[0]?.[0];

    expect(responseMessage).toMatch(
      'with value "Super user" fails to match the required pattern'
    );
  });
});
