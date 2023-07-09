const mongoose = require("mongoose");

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

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review, reviewSchema };
