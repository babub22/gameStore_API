const genreValidator = require("../../../../utils/validators/genre/genreValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("genreValidator", () => {
  test("if provided object is valid", () => {
    const result = genreValidator(validGenreObject);

    expect(result.value).toEqual(validGenreObject);
  });
  test("if provided genre name is empty", () => {
    const { error } = genreValidator({ name: "" });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("is not allowed to be empty");
  });
  test("if provided genre name too short", () => {
    const { error } = genreValidator({ name: "a" });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("length must be at least 3 characters long");
  });
  test("if provided genre name not a string", () => {
    const { error } = genreValidator({ name: 1 });
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("must be a string");
  });
  test("if genre name was not provided", () => {
    const { value } = genreValidator();

    expect(value).toBeUndefined();
  });
});

const validGenreObject = {
  name: "newGenre1",
};
