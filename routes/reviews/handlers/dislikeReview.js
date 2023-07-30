const { Review } = require("../../../models/review/review");
const REVIEW_DOES_NOT_EXISTS = require("../../../utils/responseObjects/reviews/REVIEW_DOES_NOT_EXISTS");

async function dislikeReview(req, res) {
  const {
    params: { objectId: reviewId },
    user,
  } = req;

  const review = await Review.findById(reviewId);

  if (!review) {
    const { status, message } = REVIEW_DOES_NOT_EXISTS;
    return res.status(status).send(message);
  }

  const isUserAlreadyPutDislikeOnThisReview =
    review.dislikes.checkIfThisUserAlreadyPutDislike(user);

    isUserAlreadyPutDislikeOnThisReview
    ? review.dislikes.decreaseDislikesByOne(user)
    : review.dislikes.increaseDislikesByOne(user);

    const isUserAlreadyPutLikeOnThisReview =
      review.likes.checkIfThisUserAlreadyPutLike(user);

    isUserAlreadyPutLikeOnThisReview && review.likes.decreaseLikesByOne(user);

  const saved = await review.save();

  res.send(saved);
}

module.exports = dislikeReview;
