const { Review } = require("../../../models/review/review");

async function getReviewsByGame(req, res) {
  const { objectId: gameId } = req.params;

  const reviews = await Review.getReviewsByGameId(gameId);
  res.send(reviews);
}

module.exports = getReviewsByGame;
