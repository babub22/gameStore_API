const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");
const { Game } = require("../../game");
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

  async function saveNewUserAndIncreaseReviewsCount() {
    await newReview.save();

    await User.increaseReviewsCountById({
      userId: newReview.author._id,
    });
  }

  return getResultLikeResponseObject({
    result: {
      newReview,
    },
    fn: saveNewUserAndIncreaseReviewsCount,
  });
};
