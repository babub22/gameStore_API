const jwt = require("jsonwebtoken");
const config = require("config");
const { Review } = require("../../../../models/review");
const createNewGame = require("./createNewGame");

async function getValidNewReviewProperties(token) {
  const { newGame } = await createNewGame();
  const user = jwt.verify(token, config.get("jwtPrivateKey"));

  const review = {
    game: newGame,
    author: user,
    text: new Array(15).join("a"),
    gameScore: 7,
  };

  return review;
}

async function createNewReview(token) {
  const validReviewProperties = await getValidNewReviewProperties(token);

  const newReview = new Review(validReviewProperties);

  await newReview.save();

  const reviewId = newReview._id.toHexString();

  return { reviewId, newReview };
}

module.exports = createNewReview;
