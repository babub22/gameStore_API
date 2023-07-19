const getResultObject = require("../../../utils/getResultObject");
const USER_DOES_NOT_EXIST = require("../../../utils/responseMessages/USER_DOES_NOT_EXIST");

module.exports = async function ({ userId, newRole }) {
  let result;

  const user = await this.findByIdAndUpdate(
    userId,
    {
      role: newRole,
    },
    { new: true }
  );

  if (!user) {
    result = getResultObject(false, {
      status: 404,
      message: USER_DOES_NOT_EXIST,
    });

    return result;
  }

  result = getResultObject(true, user);
  return result;
};
