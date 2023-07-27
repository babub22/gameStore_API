const compareHashedStrings = require("../../../utils/bcrypt/compareHashedStrings");
const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const INVALID_PASSWORD = require("../../../utils/responseObjects/users/INVALID_PASSWORD");
const USER_WITH_THIS_MAIL_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_WITH_THIS_MAIL_DOES_NOT_EXISTS");
const YOU_HAVE_BEEN_BLOCKED_BY = require("../../../utils/responseObjects/users/YOU_HAVE_BEEN_BLOCKED_BY");

module.exports = async function ({ password: newPassword, email }) {
  const user = await this.findOne({ email });

  const errorObject = await validateUser(user, newPassword);

  if (errorObject) {
    return await getResultLikeResponseObject({
      errorObject,
    });
  }

  const token = await user.generateAuthToken();

  return await getResultLikeResponseObject({
    result: { token, name: user.name },
  });
};

async function validateUser(user, newPassword) {
  if (!user) {
    return USER_WITH_THIS_MAIL_DOES_NOT_EXISTS;
  }

  const isBlockedUser = user.userStatus.status === "Blocked";

  if (isBlockedUser) {
    const {
      blockedBy: { name },
    } = user.userStatus.blockingInfo;

    YOU_HAVE_BEEN_BLOCKED_BY.message = `You have been blocked by ${name}, you can no longer sing in to your account!`;

    return YOU_HAVE_BEEN_BLOCKED_BY;
  }

  const isValidPassword = await compareHashedStrings(
    newPassword,
    user.password
  );

  if (!isValidPassword) {
    return INVALID_PASSWORD;
  }

  return null;
}
