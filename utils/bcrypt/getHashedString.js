const bcrypt = require("bcrypt");

async function getHashedString(string) {
  const salt = await bcrypt.genSalt(10);
  const hashedString = await bcrypt.hash(string, salt);
  return hashedString;
}

module.exports = getHashedString;
