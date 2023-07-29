const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const USER_DOES_NOT_EXISTS = require("../../../utils/responseObjects/users/USER_DOES_NOT_EXISTS");

module.exports = async function ({ userId, reviewsNumber = 1 }) {
  const reviewsCount =
    (await this.findById(userId).select("reviewsCount -_id"))?.toObject()
      .reviewsCount || 0;

  const changedReviewsCount = reviewsCount + reviewsNumber;

  const userWithIncreasedReviewsCount = await this.findOneAndUpdate(
    { _id: userId },
    {
      reviewsCount: changedReviewsCount > 0 ? changedReviewsCount : 0,
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
