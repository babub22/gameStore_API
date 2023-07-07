const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const { developerSchema } = require("./developer");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    require: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    require: true,
  },
  gameReleaseDate: {
    type: Date,
    require: true,
  },
  decription: {
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
  // number of reviews
  // average score
});

const Game = mongoose.model("Game", gameSchema);

module.exports = { Game, gameSchema };
