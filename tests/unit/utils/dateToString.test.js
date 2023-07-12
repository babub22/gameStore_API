const {
  dateToString,
  isCorrectFormat,
} = require("../../../utils/dateToString");

describe("dateToString", () => {
  test("if provided date is valid, it will return date string", () => {
    const res = dateToString(801792000000);

    expect(res).toEqual("May 30, 1995");
  });

  test.each(["", NaN, null, false, new Date("dddddd"), new Date(NaN)])(
    "if provided string in invalid date format, it will return null",
    (wrongFormat) => {
      const res = dateToString(wrongFormat);

      expect(res).toBeNull();
    }
  );
});

describe("isCorrectFormat", () => {
  test("if string date is not provided, it will return false", () => {
    const res = isCorrectFormat();

    expect(res).toBe(false);
  });
  test("if string date is invalid, it will return false", () => {
    const res = isCorrectFormat("30/05/1995");

    expect(res).toBe(false);
  });
  test("if string date is valid, it will return true", () => {
    const res = isCorrectFormat("May 30, 1995");

    expect(res).toBe(true);
  });
});
