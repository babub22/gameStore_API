const stringToDate = require("../../../utils/stringToDate");

describe("stringToDate", () => {
  test("if provided string is invalid, it will return null", () => {
    const res = stringToDate("");

    expect(res).toBeNull();
  });
  test("if provided param is not string, it will return null", () => {
    const res = stringToDate(1234);

    expect(res).toBeNull();
  });

  test.each(["13/2001", "12/05a2003", "01.21", "21", "2001/12/22", "2001"])(
    "if provided string in invalid date format, it will return null",
    (wrongFormat) => {
      const res = stringToDate(wrongFormat);

      expect(res).toBeNull();
    }
  );

  test("if provided string in DD.MM.YYYY format, it will return date", () => {
    const res = stringToDate("30.05.1992");
    const date = new Date("1992-05-29T22:00:00.000Z");

    expect(res).toEqual(date);
  });
  test("if provided string in DD/MM/YYY format, it will return date", () => {
    const res = stringToDate("30/05/1992");
    const date = new Date("1992-05-29T22:00:00.000Z");

    expect(res).toEqual(date);
  });
  test("if provided string in DD-MM-YYY format, it will return date", () => {
    const res = stringToDate("30-05-1992");
    const date = new Date("1992-05-29T22:00:00.000Z");

    expect(res).toEqual(date);
  });
});
