const config = require("config");
const decodeToken = require("../../../utils/decodeToken");
const getUserToken = require("../../utils/getUserToken");

describe("decodeToken", () => {
  const { token, objectId } = getUserToken();

  test("if token and secretkey is valid, it will return decoded token", () => {
    const result = decodeToken(token);

    expect(result._id).toEqual(objectId);
  });

  test("if secretKey is not defined, it will return null", () => {
    config.get = jest.fn().mockReturnValue(undefined);

    const result = decodeToken(token);
    expect(result).toBeNull();
  });
  test("if token was not provided, it will return null", () => {
    const result = decodeToken();

    expect(result).toBeNull();
  });
});
