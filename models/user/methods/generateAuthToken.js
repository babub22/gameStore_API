const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
      isReviewer: this.isReviewer,
    },
    config.get("jwtPrivateKey")
  );
};
