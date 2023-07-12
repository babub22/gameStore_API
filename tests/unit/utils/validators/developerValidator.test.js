const developerValidator = require("../../../../utils/validators/developer/developerValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("developerValidator", () => {
  test("if provided object is valid", () => {
    const result = developerValidator(validDeveloperObject);

    expect(result.value).toEqual(validDeveloperObject);
  });
  test("if provided genre name is empty", () => {
    const { error } = developerValidator({ name: "" });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("is not allowed to be empty");
  });
  test("if provided genre name not a string", () => {
    const { error } = developerValidator({ name: 1 });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("must be a string");
  });
  test("if genre name was not provided", () => {
    const { value } = developerValidator();

    expect(value).toBeUndefined();
  });
});

const validDeveloperObject = {
  name: "newGenre1",
};
