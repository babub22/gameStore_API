const { isEqual } = require("lodash");
const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");
const YOU_CANT_BLOCK_YOURSELF = require("../../../utils/responseObjects/users/YOU_CANT_BLOCK_YOURSELF");

module.exports = async function ({ userId, currentUser, reason }) {
  const isAdminTryingToBlockHimself = isEqual(currentUser._id, userId);

  if (isAdminTryingToBlockHimself) {
    return getResultLikeResponseObject({
      errorObject: YOU_CANT_BLOCK_YOURSELF,
    });
  }

  const blockedUser = await this.findByIdAndUpdate(
    userId,
    {
      userStatus: {
        status: "Blocked",
        blockingInfo: { reason, blockedBy: currentUser },
      },
    },
    { new: true }
  );

  return getResultLikeResponseObject({
    result: blockedUser,
    errorObject: USER_DOES_NOT_EXISTS,
  });
};
