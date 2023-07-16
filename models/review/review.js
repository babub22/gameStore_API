const mongoose = require("mongoose");
const isAdminOrModeratorRole = require("../../utils/isAdminOrModeratorRole");
const { isEqual } = require("lodash");
const likeSchema = require("./likeSchema");
const dislikeSchema = require("./dislikeSchema");

const reviewSchema = new mongoose.Schema({
  game: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 3,
        require: true,
        unique: true,
        trim: true,
      },
      releaseDate: { type: Date, require: true },
    }),
    required: true,
  },
  author: {
    type: new mongoose.Schema({
      isReviewer: { type: "Boolean" },
      name: { type: String, required: true, minlength: 3, trim: true },
    }),
    required: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 3,
  },
  gameScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  updateDate: {
    type: Date,
  },
  likes: { type: likeSchema, default: { likeSchema } },
  dislikes: { type: dislikeSchema, default: { dislikeSchema } },
});

reviewSchema.statics.getReviewsByGameId = function (gameId) {
  return this.find({
    "game._id": gameId,
  });
};

reviewSchema.statics.getReviewsByAuthorId = function (gameId) {
  return this.find({
    "author._id": gameId,
  });
};

reviewSchema.statics.checkIfProvidedUserWroteThisReview = async function (
  reviewId,
  user
) {
  const review = await this.findById(reviewId);

  if (!review) {
    return { status: 404, message: "This review does not exist!" };
  }

  const isUserRole = !isAdminOrModeratorRole(user.role);

  const authorId = review.author._id.toHexString();
  const { _id: userId } = user;

  const isSameAuthorAndUserInRequest = isEqual(authorId, userId);

  if (!isSameAuthorAndUserInRequest && isUserRole) {
    return {
      status: 403,
      message: "You dont have permission to change this review!",
    };
  }
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review, reviewSchema };
