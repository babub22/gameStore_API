const mongoose = require("mongoose");

const dislikedUsersSchema = new mongoose.Schema({
  type: new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      trim: true,
      required: true,
    },
    dislikesDate: { type: Date, default: Date.now(), required: true },
  }),
});

const dislikeSchema = new mongoose.Schema({
  dislikedUsers: {
    type: [dislikedUsersSchema],
    required: true,
  },
  dislikesCount: {
    type: Number,
    min: 0,
    default: 0,
  },
});

module.exports = dislikeSchema;
