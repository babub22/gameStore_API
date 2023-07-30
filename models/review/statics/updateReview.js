const { Game } = require("../../../models/game/game");
const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");

module.exports = async function ({ req, reviewId }) {
  const { isValidRequest, resultBody } =
    await this.checkIfProvidedUserWroteThisReview(reviewId, req.user);

  if (!isValidRequest) {
    return getResultLikeResponseObject({
      errorObject: resultBody,
    });
  }

  const updatedReview = await this.findByIdAndUpdate(
    reviewId,
    { ...req.body, updateDate: Date.now() },
    {
      new: true,
    }
  );

  async function updateAvarageScore() {
    const avarageScoreForThisGame = await this.getAvarageScoreForGame({
      gameId: updatedReview.game._id,
    });

    await Game.updateAverageScore({
      gameId: updatedReview.game._id,
      averageScore: avarageScoreForThisGame,
    });
  }

  return getResultLikeResponseObject({
    result: {
      updatedReview,
    },
    fn: updateAvarageScore.bind(this),
  });
};
