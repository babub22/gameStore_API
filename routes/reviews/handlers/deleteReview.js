const { Review } = require("../../../models/review/review");

async function deleteReview(req, res) {
  const { objectId: reviewId } = req.params;

  const { isValidRequest, resultBody } =
    await Review.checkIfProvidedUserWroteThisReview(reviewId, req.user);

  if (!isValidRequest) {
    const { status, message } = resultBody;
    return res.status(status).send(message);
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);

  res.send(deletedReview);
}

module.exports = deleteReview;
