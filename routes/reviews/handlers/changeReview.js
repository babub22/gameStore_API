const { Review } = require("../../../models/review/review");

async function changeReview(req, res) {
  const { objectId: reviewId } = req.params;

  const { isValidRequest, resultBody } = await Review.updateReview({
    reviewId,
    req,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.status(200).send(resultBody.updatedReview);
}

module.exports = changeReview;
