const winston = require("winston");

const logging = require("../../../setup/logging");

describe("logging", () => {
  test("if NODE_ENV === test", () => {
    winston.add = jest.fn();
    process.env.NODE_ENV = "test";

    logging();
    expect(winston.add).toHaveBeenCalled();
  });
  test("if NODE_ENV === dev", () => {
    winston.exceptions.handle = jest.fn();
    process.env.NODE_ENV = "dev";

    logging();
    expect(winston.exceptions.handle).toHaveBeenCalled();
  });
});

logging();
