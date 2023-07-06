const bcrypt = require("bcrypt");
const winston = require("winston");

const compareHashedStrings = require("../../../utils/bcrypt/compareHashedStrings");

describe("compareHashedStrings", () => {
  test("if string and hashed string was not provided, it will return false", async () => {
    const result = await compareHashedStrings();

    expect(result).toBe(false);
  });
  test("if string was provided, it will return false", async () => {
    const result = await compareHashedStrings("1234");

    expect(result).toBe(false);
  });

  test("if we have an error from bcrypt.compare, it will return false", async () => {
    const hashedString =
      "$2b$10$H5lXfqrp/Gp8AE6EtgDV1uSPO6ZQQ46EifEFVjl3VzQ2E/BI7HqYC";

    bcrypt.compare = jest.fn().mockRejectedValue(new Error("Error"));
    winston.error = jest.fn();

    await compareHashedStrings("1234", hashedString);

    expect(winston.error).toHaveBeenCalled();
  });
});
