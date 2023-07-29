const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");
const { Game } = require("../../game/game");
const { User } = require("../../user/user");

module.exports = async function ({
  gameId,
  req: { user: currentUser, body: newReviewBody },
}) {
  const game = await Game.findById(gameId);

  if (!game) {
    return getResultLikeResponseObject({
      errorObject: THIS_GAME_DOES_NOT_EXISTS,
    });
  }

  const newReview = new this({
    ...newReviewBody,
    author: { ...currentUser },
    game,
  });

  async function saveNewReviewAndIncreaseReviewsCount() {
    await newReview.save();

    await User.increaseReviewsCountById({
      userId: newReview.author._id,
    });

    await Game.increaseReviewsCountByGameId({
      gameId,
    });

    const avarageScoreForThisGame = await this.getAvarageScoreForGame({
      gameId,
    });

    await Game.updateAverageScore({
      gameId,
      averageScore: avarageScoreForThisGame,
    });
  }

  return getResultLikeResponseObject({
    result: {
      newReview,
    },
    fn: saveNewReviewAndIncreaseReviewsCount.bind(this),
  });
};
