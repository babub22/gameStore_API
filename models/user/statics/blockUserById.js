const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");

module.exports = async function ({ userId, currentUser, reason }) {
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
