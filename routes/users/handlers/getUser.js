const { User } = require("../../../models/user/user");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");

async function getUser(req, res) {
  const { objectId: userId } = req.params;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).send(USER_DOES_NOT_EXISTS);
  }

  res.send(user);
}

module.exports = getUser;
