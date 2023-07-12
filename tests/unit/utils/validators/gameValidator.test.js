const mongoose = require("mongoose");
const gameValidator = require("../../../../utils/validators/game/gameValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("gameValidator", () => {
  test("if provided object is valid", () => {
    const result = gameValidator(validNewGameRequestBody);

    expect(result.value).toEqual(validNewGameRequestBody);
  });
  test("if game object was not provided", () => {
    const { value } = gameValidator();

    expect(value).toBeUndefined();
  });

  describe("title", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("title", "");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("title", 0);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("length less than 3", () => {
      const requestBody = changeValueByKey("title", "aa");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("length must be at least 3 characters long");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("title", "");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });

  describe("price", () => {
    test("not a number", () => {
      const requestBody = changeValueByKey("price", "one");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a number");
    });

    test("less than 0", () => {
      const requestBody = changeValueByKey("price", -1);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be greater than or equal to 0");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("price");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });

  describe("releaseDate", () => {
    test("not a date", () => {
      const requestBody = changeValueByKey("releaseDate", "aaaaa");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid date");
    });

    test("invalid date", () => {
      const requestBody = changeValueByKey("releaseDate", NaN);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid date");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("releaseDate");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });

  describe("description", () => {
    test("length less than 25", () => {
      const requestBody = changeValueByKey("description", "aaa");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("length must be at least 25 characters long");
    });

    test("is not a string", () => {
      const requestBody = changeValueByKey("description", 0);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("description");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });

  describe("developerId", () => {
    test("is not a objectID", () => {
      const requestBody = changeValueByKey("developerId", 123456789);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be one of");
    });

    test("was not provided", () => {
      const requestBody = changeValueByKey("developerId");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });

  describe("genreId", () => {
    test("is not a objectID", () => {
      const requestBody = changeValueByKey("genreId", 123456789);

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be one of");
    });

    test("was not provided", () => {
      const requestBody = changeValueByKey("genreId");

      const { error } = gameValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });
});

function changeValueByKey(key, newValue) {
  return { ...validNewGameRequestBody, [key]: newValue };
}

const validNewGameRequestBody = {
  title: "newGame",
  price: 20,
  releaseDate: new Date("1970-05-30"),
  description: new Array(26).join("a"),
  developerId: new mongoose.Types.ObjectId().toHexString(),
  genreId: new mongoose.Types.ObjectId().toHexString(),
};
