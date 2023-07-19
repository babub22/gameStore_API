const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");

module.exports = async function ({ userId, newRole }) {
  const changedUserRole = await this.findByIdAndUpdate(
    userId,
    {
      role: newRole,
    },
    { new: true }
  );

  return getResultLikeResponseObject({
    result: changedUserRole,
    errorObject: USER_DOES_NOT_EXISTS,
  });
};
