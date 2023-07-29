const { Review } = require("../../../../models/review/review");
const createNewGame = require("./createNewGame");
const decodeToken = require("../../../../utils/decodeToken");

async function getValidNewReviewObject(token, alreadyCreatedGame) {
  let game = alreadyCreatedGame;

  if (!alreadyCreatedGame) {
    const { newGame } = await createNewGame();
    game = newGame;
  }

  const user = decodeToken(token);

  const review = {
    game,
    author: user,
    text: new Array(15).join("a"),
    gameScore: 7,
  };

  return review;
}

async function createNewReview(token, alreadyCreatedGame) {
  const validReviewProperties = await getValidNewReviewObject(
    token,
    alreadyCreatedGame
  );

  const newReview = new Review(validReviewProperties);

  await newReview.save();

  const reviewId = newReview._id.toHexString();

  return { reviewId, newReview };
}

module.exports = createNewReview;
