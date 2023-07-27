const mongoose = require("mongoose");
const increaseDislikesByOne = require("./methods/increaseDislikesByOne");
const decreaseDislikesByOne = require("./methods/decreaseDislikesByOne");

const dislikedUsersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    trim: true,
    required: true,
  },
  dislikesDate: { type: Date, default: Date.now(), required: true },
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

dislikeSchema.methods.increaseDislikesByOne = increaseDislikesByOne;
dislikeSchema.methods.decreaseDislikesByOne = decreaseDislikesByOne;

dislikeSchema.methods.checkIfThisUserAlreadyPutDislike = function (user) {
  const isThisUserAlredyPutDislike = this.dislikedUsers.find(
    (likedUser) => likedUser._id.toHexString() === user._id
  );

  return isThisUserAlredyPutDislike;
};

module.exports = dislikeSchema;
