const getResultObject = require("../../../utils/getResultObject");

module.exports = async function ({ userId, currentUser, reason }) {
  let result;

  const user = await this.findByIdAndUpdate(
    userId,
    {
      userStatus: {
        status: "Blocked",
        blockingInfo: { reason, blockedBy: currentUser },
      },
    },
    { new: true }
  );

  if (!user) {
    result = getResultObject(false, {
      status: 404,
      message: "This user doesnt exist!",
    });

    return result;
  }

  result = getResultObject(true, {
    isValidRequest: true,
    user,
  });
  return result;
};
