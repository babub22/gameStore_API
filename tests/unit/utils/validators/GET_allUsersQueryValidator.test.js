const GET_allUsersQueryValidator = require("../../../../utils/validators/user/GET_allUsersQueryValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

const validQuery = {
  limit: 5,
  sortBy: "name",
  role: "User",
};

describe("GET_allUsersQueryValidator", () => {
  test("if provided query is valid", () => {
    const result = GET_allUsersQueryValidator(validQuery);

    expect(result.value).toEqual(validQuery);
  });

  describe("if limit", () => {
    test("is not a number", () => {
      const { error } = GET_allUsersQueryValidator({
        ...validQuery,
        limit: true,
      });

      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a number");
    });
  });

  test("less than 2, it will return error", () => {
    const { error } = GET_allUsersQueryValidator({
      ...validQuery,
      limit: 1,
    });

    const message = extractMessageFromJoiError(error);

    expect(message).toMatch("must be greater than or equal to 2");
  });

  describe("if sortBy", () => {
    test("is not a string", () => {
      const { error } = GET_allUsersQueryValidator({
        ...validQuery,
        sortBy: true,
      });

      const message = extractMessageFromJoiError(error);

      expect(message).toMatch("must be a string");
    });
    test("is invalid 'sortBy' value", () => {
      const { error } = GET_allUsersQueryValidator({
        ...validQuery,
        sortBy: "age",
      });

      const message = extractMessageFromJoiError(error);

      expect(message).toMatch(
        'with value "age" fails to match the required pattern:'
      );
    });
  });

  describe("if display", () => {
    test("is not a string", () => {
      const { error } = GET_allUsersQueryValidator({
        ...validQuery,
        role: 10,
      });

      const message = extractMessageFromJoiError(error);

      expect(message).toMatch('"role" must be a string');
    });
    test("is invalid 'display' value", () => {
      const { error } = GET_allUsersQueryValidator({
        ...validQuery,
        role: "SuperUser",
      });

      const message = extractMessageFromJoiError(error);

      expect(message).toMatch(
        'with value "SuperUser" fails to match the required pattern'
      );
    });

    test('is a valid role="Reviewer"', () => {
      const result = GET_allUsersQueryValidator({
        ...validQuery,
        role: "Reviewer",
      });

      expect(result.value).toEqual({
        ...validQuery,
        role: "Reviewer",
      });
    });

    test('is a valid role="Moderator"', () => {
      const result = GET_allUsersQueryValidator({
        ...validQuery,
        role: "Moderator",
      });

      expect(result.value).toEqual({
        ...validQuery,
        role: "Moderator",
      });
    });

    test('is a valid role="Admin"', () => {
      const result = GET_allUsersQueryValidator({
        ...validQuery,
        role: "Admin",
      });

      expect(result.value).toEqual({
        ...validQuery,
        role: "Admin",
      });
    });
  });
});
