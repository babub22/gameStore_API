const moment = require("moment");

const correctFormat = "MMM D, YYYY";

function dateToString(string) {
  const isValidDate = moment(string).isValid();

  if (!isValidDate) {
    return null;
  }

  const dateString = moment(string).format(correctFormat);

  return dateString;
}

function isCorrectFormat(dateString) {
  return moment(dateString, correctFormat, true).isValid();
}

module.exports = { dateToString, isCorrectFormat };
