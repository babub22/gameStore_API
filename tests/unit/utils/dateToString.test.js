const { dateToString } = require("../../../utils/dateToString");

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
