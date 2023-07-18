const changeRoleQueryValidator = require("../../../../utils/validators/user/changeRoleQueryValidator");
const extractMessageFromJoiError = require("./utils/extractMessageFromJoiError");

describe("changeRoleQueryValidator", () => {
  test("if provided role is 'Admin', it will pass", () => {
    const result = changeRoleQueryValidator({ role: "Admin" });

    expect(result.value).toEqual({ role: "Admin" });
  });
  test("if provided role is 'User', it will pass", () => {
    const result = changeRoleQueryValidator({ role: "User" });

    expect(result.value).toEqual({ role: "User" });
  });
  test("if provided role is 'Moderator', it will pass", () => {
    const result = changeRoleQueryValidator({ role: "Moderator" });

    expect(result.value).toEqual({ role: "Moderator" });
  });
  test("if provided role doesnt exist", () => {
    const { error } = changeRoleQueryValidator({ role: "Super user" });

    const message = extractMessageFromJoiError(error);

    expect(message).toMatch(
      '"role" with value "Super user" fails to match the required pattern'
    );
  });
  test("if provided query has invalid key", () => {
    const { error } = changeRoleQueryValidator({ to: "User" });

    const message = extractMessageFromJoiError(error);

    expect(message).toMatch('"role" is required');
  });
  test("if query was not provided", () => {
    const { value } = changeRoleQueryValidator();

    expect(value).toBeUndefined();
  });
});
