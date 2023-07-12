const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");
const registrationDataValidator = require("../../../../utils/validators/user/registrationDataValidator");

describe("registrationDataValidator", () => {
  test("if provided object is valid", () => {
    const result = registrationDataValidator(validLoginRequestBody);

    expect(result.value).toEqual(validLoginRequestBody);
  });

  test("if game object was not provided", () => {
    const { value } = registrationDataValidator();

    expect(value).toBeUndefined();
  });

  describe("email", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("email", "");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("email", 0);

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("invalid email", () => {
      const requestBody = changeValueByKey("email", "test@gmailcom");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid email");
    });

    test("email without domain", () => {
      const requestBody = changeValueByKey("email", "test@");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a valid email");
    });

    test("was not provided", () => {
      const requestBody = changeValueByKey("email", "");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });

  describe("password", () => {
    test("not a string", () => {
      const requestBody = changeValueByKey("password", 123456);

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("password");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is required");
    });
  });

  describe("name", () => {
    test("is empty", () => {
      const requestBody = changeValueByKey("name", "");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });

    test("not a string", () => {
      const requestBody = changeValueByKey("name", 0);

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });

    test("length less than 3", () => {
      const requestBody = changeValueByKey("name", "aa");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("length must be at least 3 characters long");
    });
    test("was not provided", () => {
      const requestBody = changeValueByKey("name", "");

      const { error } = registrationDataValidator(requestBody);
      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("is not allowed to be empty");
    });
  });
});

function changeValueByKey(key, newValue) {
  return { ...validLoginRequestBody, [key]: newValue };
}

const validLoginRequestBody = {
  email: "test@gmail.com",
  password: "123456",
  name: "name",
};
