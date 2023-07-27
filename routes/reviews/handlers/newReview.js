const { Review } = require("../../../models/review/review");

async function newReview(req, res) {
  const { objectId: gameId } = req.params;

  const { isValidRequest, resultBody } = await Review.createNewReview({
    gameId,
    req,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.status(201).send(resultBody.newReview);
}

module.exports = newReview;
