const { Review } = require("../../../models/review/review");

async function deleteReview(req, res) {
  const { objectId: reviewId } = req.params;

  const { isValidRequest, resultBody } = await Review.deleteReview({
    reviewId,
    user: req.user,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.status(200).send(resultBody.deletedReview);
}

module.exports = deleteReview;
