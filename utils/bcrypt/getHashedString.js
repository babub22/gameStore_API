const bcrypt = require("bcrypt");
const winston = require("winston");

async function getHashedString(string) {
  if (!string) {
    return null;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(string, salt);

    return hashedString;
  } catch (err) {
    winston.error(err.message, err);
  }
}

module.exports = getHashedString;
