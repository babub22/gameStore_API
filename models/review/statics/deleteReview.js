const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const { Game } = require("../../game/game");
const { User } = require("../../user/user");

module.exports = async function ({ reviewId, user }) {
  const { isValidRequest, resultBody } =
    await this.checkIfProvidedUserWroteThisReview(reviewId, user);

  if (!isValidRequest) {
    return getResultLikeResponseObject({
      errorObject: resultBody,
    });
  }

  const deletedReview = await this.findByIdAndDelete(reviewId);

  async function deleteReviewAndDecreaseReviewsCount() {
    await User.increaseReviewsCountById({
      userId: deletedReview.author._id,
      reviewsNumber: -1,
    });

    await Game.increaseReviewsCountByGameId({
      gameId: deletedReview.game._id,
      reviewsNumber: -1,
    });

    const avarageScoreForThisGame = await this.getAvarageScoreForGame({
      gameId: deletedReview.game._id,
    });

    await Game.updateAverageScore({
      gameId: deletedReview.game._id,
      score: avarageScoreForThisGame,
    });
  }

  return getResultLikeResponseObject({
    result: {
      deletedReview,
    },
    fn: deleteReviewAndDecreaseReviewsCount.bind(this),
  });
};
