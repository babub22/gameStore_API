const mongoose = require("mongoose");
const { genreSchema } = require("../genre");
const { developerSchema } = require("../developer");
const { isCorrectFormat } = require("../../utils/dateToString");
const increaseReviewsCountByGameId = require("./statics/increaseReviewsCountByGameId");
const updateAverageScore = require("./statics/updateAverageScore");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    require: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    require: true,
  },
  releaseDate: {
    type: String,
    validate: {
      validator: (dateString) => isCorrectFormat(dateString),
    },
    require: true,
  },
  description: {
    type: String,
    minlength: 25,
    require: true,
    trim: true,
  },
  genre: genreSchema,
  developer: developerSchema,
  creationDate: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  updateDate: {
    type: Date,
  },
  addedBy: String,
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
});

gameSchema.statics.increaseReviewsCountByGameId = increaseReviewsCountByGameId;
gameSchema.statics.updateAverageScore = updateAverageScore;

const Game = mongoose.model("Game", gameSchema);

module.exports = { Game, gameSchema };
