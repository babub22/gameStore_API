const { Review } = require("../../../models/review/review");

async function changeReview(req, res) {
  const { objectId: reviewId } = req.params;

  const { isValidRequest, resultBody } =
    await Review.checkIfProvidedUserWroteThisReview(reviewId, req.user);

  if (!isValidRequest) {
    const { status, message } = resultBody;
    return res.status(status).send(message);
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
  });

  res.send(updatedReview);
}

module.exports = changeReview;
