const decodeToken = require("../utils/decodeToken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("No authentication token provided!");
  }

  try {
    const payload = decodeToken(token);
    req.user = payload;

    next();
  } catch {
    res.status(400).send("Invalid authentication token!");
  }
}

module.exports = auth;
