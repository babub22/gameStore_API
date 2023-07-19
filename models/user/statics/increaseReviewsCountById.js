const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");

module.exports = async function ({ userId: userId, reviewsNumber = 1 }) {
  const userWithIncreasedReviewsCount = await this.findOneAndUpdate(
    { _id: userId },
    {
      $inc: { reviewsCount: reviewsNumber },
    },
    { new: true, setDefaultsOnInsert: true }
  );

  async function setIsReviewerAndSaveUser() {
    userWithIncreasedReviewsCount.isReviewer =
      userWithIncreasedReviewsCount.reviewsCount > 30;
    await userWithIncreasedReviewsCount.save();
  }

  return getResultLikeResponseObject({
    result: userWithIncreasedReviewsCount,
    errorObject: USER_DOES_NOT_EXISTS,
    fn: setIsReviewerAndSaveUser,
  });
};
