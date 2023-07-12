const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");
const loginDataValidator = require("../../../../utils/validators/user/loginDataValidator");

describe("loginDataValidator", () => {
  test("if provided object is valid", () => {
    const result = loginDataValidator(validLoginRequestBody);

    expect(result.value).toEqual(validLoginRequestBody);
  });

  test("if game object was not provided", () => {
    const { value } = loginDataValidator();

    expect(value).toBeUndefined();
  });

  describe("email", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("email", "");

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("email", 0);

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("invalid email", () => {
      const requestBody = changeValueByKey("email", "test@gmailcom");

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid email");
    });

    test("email without domain", () => {
      const requestBody = changeValueByKey("email", "test@");

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid email");
    });

    test("was not provided", () => {
      const requestBody = changeValueByKey("email", "");

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });

  describe("password", () => {
    test("not a string", () => {
      const requestBody = changeValueByKey("password", 123456);

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("password");

      const { error } = loginDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });
});

function changeValueByKey(key, newValue) {
  return { ...validLoginRequestBody, [key]: newValue };
}

const validLoginRequestBody = {
  email: "test@gmail.com",
  password: "123456",
};
