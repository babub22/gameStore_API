const config = require("config");
const jwt = require("jsonwebtoken");

function decodeToken(token) {
  const secretKey = config.get("jwtPrivateKey");

  if (!secretKey || !token) {
    return null;
  }

  return jwt.verify(token, secretKey);
}

module.exports = decodeToken;
