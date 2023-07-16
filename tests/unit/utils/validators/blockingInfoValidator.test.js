const blockingInfoValidator = require("../../../../utils/validators/user/blockingInfoValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("blockingInfoValidator", () => {
  test("if provided object is valid", () => {
    const result = blockingInfoValidator({ reason: "Test test" });

    expect(result.value).toEqual({ reason: "Test test" });
  });
  test("if provided blocking reason is empty", () => {
    const { error } = blockingInfoValidator({ reason: "" });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("is not allowed to be empty");
  });
  test("if provided blocking reason not a string", () => {
    const { error } = blockingInfoValidator({ reason: 1 });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("must be a string");
  });
  test("if blocking reason was not provided", () => {
    const { value } = blockingInfoValidator();

    expect(value).toBeUndefined();
  });
});
