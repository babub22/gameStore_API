const { User } = require("../../../models/user/user");

async function singUp(req, res) {
  const { isValidRequest, resultBody } = await User.validateSingup(req.body);

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.header("x-auth-token", resultBody.token).send(resultBody.newUser);
}

module.exports = singUp;
