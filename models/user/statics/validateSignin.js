const compareHashedStrings = require("../../../utils/bcrypt/compareHashedStrings");
const getResultObject = require("../../../utils/getResultObject");

module.exports = async function ({ password, email }) {
  const user = await this.findOne({ email });
  let result;

  if (!user) {
    result = getResultObject(false, {
      status: 404,
      message: "User with this mail doesnt exist!",
    });

    return result;
  }

  const isBlockedUser = user.userStatus.status === "Blocked";

  if (isBlockedUser) {
    const { blockedBy } = user.userStatus.blockingInfo;

    result = getResultObject(false, {
      status: 403,
      message: `You have been blocked by ${blockedBy.name}, you can no longer sing in to your account!`,
    });

    return result;
  }

  const isValidPassword = await compareHashedStrings(password, user.password);

  if (!isValidPassword) {
    result = getResultObject(false, {
      status: 404,
      message: "Password is wrong!",
    });

    return result;
  }

  const token = await user.generateAuthToken();

  result = getResultObject(true, { token, name: user.name });
  return result;
};
