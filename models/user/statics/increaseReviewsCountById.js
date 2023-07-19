const getResultObject = require("../../../utils/getResultObject");
const USER_DOES_NOT_EXIST = require("../../../utils/responseMessages/USER_DOES_NOT_EXIST");

module.exports = async function ({ userId: userId, reviewsNumber = 1 }) {
  const user = await this.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { reviewsCount: reviewsNumber },
    },
    { new: true, setDefaultsOnInsert: true }
  );

  let result;

  if (!user) {
    result = getResultObject(false, {
      status: 404,
      message: USER_DOES_NOT_EXIST,
    });

    return result;
  }

  user.isReviewer = user.reviewsCount > 30;
  await user.save();

  result = getResultObject(true, user);
  return result;
};
