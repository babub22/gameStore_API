const getResultObject = require("../../../utils/getResultObject");

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
      message: "This user doesnt exist!",
    });

    return result;
  }

  result = getResultObject(true, user);
  return result;
};
