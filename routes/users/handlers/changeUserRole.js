const { User } = require("../../../models/user/user");

async function changeUserRole(req, res) {
  const { objectId: userId } = req.params;
  const { role: newRole } = req.query;

  const { isValidRequest, resultBody } = await User.changeRoleById({
    userId,
    newRole,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.send(resultBody);
}

module.exports = changeUserRole;
