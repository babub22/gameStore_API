const { isEqual } = require("lodash");
const isAdminOrModeratorRole = require("../../../utils/isAdminOrModeratorRole");
const DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW = require("../../../utils/responseObjects/reviews/DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW");
const REVIEW_DOES_NOT_EXISTS = require("../../../utils/responseObjects/reviews/REVIEW_DOES_NOT_EXISTS");
const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");

module.exports = async function (reviewId, user) {
  const review = await this.findById(reviewId);

  const errorObject = await validateReview(review, user);

  if (errorObject) {
    return await getResultLikeResponseObject({
      errorObject,
    });
  }

  return getResultLikeResponseObject({ result: true });
};

async function validateReview(review, user) {
  if (!review) {
    return REVIEW_DOES_NOT_EXISTS;
  }

  const isUserRole = !isAdminOrModeratorRole(user.role);

  const authorId = review.author._id.toHexString();
  const { _id: userId } = user;

  const isSameAuthorAndUserInRequest = isEqual(authorId, userId);

  if (!isSameAuthorAndUserInRequest && isUserRole) {
    return DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW;
  }

  return null;
}
