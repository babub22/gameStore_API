const bcrypt = require("bcrypt");
const winston = require("winston");

async function compareHashedStrings(string, hashedString) {
  if (!string || !hashedString) {
    return false;
  }

  try {
    const result = await bcrypt.compare(string, hashedString);

    return result;
  } catch (err) {
    winston.error(err.message, err);
  }
}

module.exports = compareHashedStrings;
