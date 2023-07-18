const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");
const PUT_reviewValidator = require("../../../../utils/validators/review/PUT_reviewValidator");
const getHexedObjectId = require("../../../../utils/getHexedObjectId");

describe("PUT_reviewValidator", () => {
  test("if provided object is valid", () => {
    const result = PUT_reviewValidator(validNewReviewRequestBody);

    expect(result.value).toEqual(validNewReviewRequestBody);
  });

  test("if game object was not provided", () => {
    const { value } = PUT_reviewValidator();

    expect(value).toBeUndefined();
  });

  test("if sended object have wrong properties", () => {
    const { error } = PUT_reviewValidator(validNewGameRequestBody);
    const message = extractMessageFromJoiError(error);

    expect(message).toMatch('"text" is required');
  });

  describe("text", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("text", "");

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("text", 0);

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("length less than 3", () => {
      const requestBody = changeValueByKey("text", "aa");

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("length must be at least 3 characters long");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("text", "");

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });

  describe("gameScore", () => {
    test("not a number", () => {
      const requestBody = changeValueByKey("gameScore", "one");

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a number");
    });

    test("less than 0", () => {
      const requestBody = changeValueByKey("gameScore", -1);

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be greater than or equal to 0");
    });

    test("more than 10", () => {
      const requestBody = changeValueByKey("gameScore", 11);

      const { error } = PUT_reviewValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be less than or equal to 10");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("gameScore");

      const { error } = PUT_reviewValidator(requestBody);
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
};

const validNewGameRequestBody = {
  title: "newGame",
  price: 20,
  releaseDate: new Date("1970-05-30"),
  description: new Array(26).join("a"),
  developerId: getHexedObjectId(),
  genreId: getHexedObjectId(),
};
