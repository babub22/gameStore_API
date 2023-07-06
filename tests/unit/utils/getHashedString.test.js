const bcrypt = require("bcrypt");
const winston = require("winston");

const getHashedString = require("../../../utils/bcrypt/getHashedString");
const compareHashedStrings = require("../../../utils/bcrypt/compareHashedStrings");

describe("getHashedString", () => {
  test("if no string provided, it will return empty string", async () => {
    const hashedString = await getHashedString();

    expect(hashedString).toBeNull();
  });
  test("if the string and hashed password match", async () => {
    const password = "1234";
    const hashedString = await getHashedString(password);

    const isCorrect = await compareHashedStrings(password, hashedString);

    expect(isCorrect).toBe(true);
  });

  test("if we have an error from bcrypt.genSalt, it will return false", async () => {
    bcrypt.genSalt = jest.fn().mockRejectedValue(new Error("Error"));
    winston.error = jest.fn();

    await getHashedString("1234");

    expect(winston.error).toHaveBeenCalled();
  });

  test("if we have an error from bcrypt.hash, it will return false", async () => {
    bcrypt.hash = jest.fn().mockRejectedValue(new Error("Error"));
    winston.error = jest.fn();

    await getHashedString("1234");

    expect(winston.error).toHaveBeenCalled();
  });
});
