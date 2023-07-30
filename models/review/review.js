const mongoose = require("mongoose");
const likeSchema = require("./likeSchema");
const dislikeSchema = require("./dislikeSchema");
const getReviewsByGameId = require("./statics/getReviewsByGameId");
const getReviewsByAuthorId = require("./statics/getReviewsByAuthorId");
const checkIfProvidedUserWroteThisReview = require("./statics/checkIfProvidedUserWroteThisReview");
const createNewReview = require("./statics/createNewReview");
const getAvarageScoreForGame = require("./statics/getAverageScoreForGame");
const deleteReview = require("./statics/deleteReview");

const reviewSchema = new mongoose.Schema({
  game: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 3,
        require: true,
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
  updateDate: {
    type: Date,
  },
  likes: { type: likeSchema, default: { likeSchema } },
  dislikes: { type: dislikeSchema, default: { dislikeSchema } },
});

reviewSchema.statics.getReviewsByGameId = getReviewsByGameId;
reviewSchema.statics.getReviewsByAuthorId = getReviewsByAuthorId;
reviewSchema.statics.checkIfProvidedUserWroteThisReview =
  checkIfProvidedUserWroteThisReview;
reviewSchema.statics.createNewReview = createNewReview;
reviewSchema.statics.getAvarageScoreForGame = getAvarageScoreForGame;
reviewSchema.statics.deleteReview = deleteReview;

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review, reviewSchema };
