const { User } = require("../../../models/user/user");

async function singIn(req, res) {
  const { isValidRequest, resultBody } = await User.validateSignin(req.body);

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res
    .header("x-auth-token", resultBody.token)
    .send(`Welcome ${resultBody.name}!`);
}

module.exports = singIn;
