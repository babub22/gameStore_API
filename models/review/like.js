const mongoose = require("mongoose");

const likedUsersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    trim: true,
    required: true,
  },
  likesDate: { type: Date, default: Date.now(), required: true },
});

const likesSchema = new mongoose.Schema({
  likedUsers: {
    type: [likedUsersSchema],
    required: true,
  },
  likesCount: {
    type: Number,
    min: 0,
    default: 0,
  },
});

module.exports = likesSchema;
