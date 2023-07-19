const { User } = require("../../../models/user/user");

async function blockUser(req, res) {
  const { objectId: userId } = req.params;
  const { reason } = req.body;
  const currentUser = req.user;

  const { isValidRequest, resultBody } = await User.blockUserById({
    userId,
    reason,
    currentUser,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.send(resultBody);
}

module.exports = blockUser;
