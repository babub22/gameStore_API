const { Review } = require("../../../models/review/review");
const REVIEW_DOES_NOT_EXISTS = require("../../../utils/responseObjects/reviews/REVIEW_DOES_NOT_EXISTS");

async function likeReview(req, res) {
  const {
    params: { objectId: reviewId },
    user,
  } = req;

  const review = await Review.findById(reviewId);

  if (!review) {
    const { status, message } = REVIEW_DOES_NOT_EXISTS;
    return res.status(status).send(message);
  }

  const isUserAlreadyPutLikeOnThisReview =
    review.likes.checkIfThisUserAlreadyPutLike(user);

  isUserAlreadyPutLikeOnThisReview
    ? review.likes.decreaseLikesByOne(user)
    : review.likes.increaseLikesByOne(user);

  const isUserAlreadyPutDislikeOnThisReview =
    review.dislikes.checkIfThisUserAlreadyPutDislike(user);

  isUserAlreadyPutDislikeOnThisReview &&
    review.dislikes.decreaseDislikesByOne(user);

  const saved = await review.save();

  res.send(saved);
}

module.exports = likeReview;
