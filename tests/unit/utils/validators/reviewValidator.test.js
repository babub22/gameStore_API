const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");
const reviewValidator = require("../../../../utils/validators/review/reviewValidator");
const getHexedObjectId = require("../../../../utils/getHexedObjectId");

describe("reviewValidator", () => {
  test("if provided object is valid", () => {
    const result = reviewValidator(validNewReviewRequestBody);

    expect(result.value).toEqual(validNewReviewRequestBody);
  });

  test("if game object was not provided", () => {
    const { value } = reviewValidator();

    expect(value).toBeUndefined();
  });

  describe("text", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("text", "");

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("text", 0);

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("length less than 3", () => {
      const requestBody = changeValueByKey("text", "aa");

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("length must be at least 3 characters long");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("text", "");

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });

  describe("gameScore", () => {
    test("not a number", () => {
      const requestBody = changeValueByKey("gameScore", "one");

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a number");
    });

    test("less than 0", () => {
      const requestBody = changeValueByKey("gameScore", -1);

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be greater than or equal to 0");
    });

    test("more than 10", () => {
      const requestBody = changeValueByKey("gameScore", 11);

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be less than or equal to 10");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("gameScore");

      const { error } = reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });
});

function changeValueByKey(key, newValue) {
  return { ...validNewReviewRequestBody, [key]: newValue };
}

const validNewReviewRequestBody = {
  text: "newGame",
  gameScore: 20,
  gameId: getHexedObjectId(),
};
