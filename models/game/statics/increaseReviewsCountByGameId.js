const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");

module.exports = async function ({ gameId, reviewsNumber = 1 }) {
  const reviewsCount =
    (await this.findById(gameId).select("reviewsCount -_id"))?.toObject()
      .reviewsCount || 0;

  const changedReviewsCount = reviewsCount + reviewsNumber;

  const gameWithIncreasedReviewsCount = await this.findOneAndUpdate(
    { _id: gameId },
    {
      reviewsCount: changedReviewsCount > 0 ? changedReviewsCount : 0,
    },
    { new: true, setDefaultsOnInsert: true }
  );

  return getResultLikeResponseObject({
    result: gameWithIncreasedReviewsCount,
    errorObject: THIS_GAME_DOES_NOT_EXISTS,
  });
};
