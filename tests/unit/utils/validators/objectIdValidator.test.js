const objectIdValidator = require("../../../../utils/validators/objectIdValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("objectIdValidator", () => {
  test("if it is not a valid objectID", () => {
    const { error } = objectIdValidator({ objectId: 123456789 });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("must be one of");
  });
});
