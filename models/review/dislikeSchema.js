const mongoose = require("mongoose");

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

dislikeSchema.methods.increaseDislikesByOne = function (user) {
  this.dislikesCount += 1;
  this.dislikedUsers.push(user);
};

dislikeSchema.methods.decreaseDislikesByOne = function (user) {
  this.dislikesCount -= 1;
  this.dislikedUsers.filter(
    (likedUser) => likedUser._id.toHexString() === user._id
  );
};

dislikeSchema.methods.checkIfThisUserAlreadyPutDislike = function (user) {
  const isThisUserAlredyPutLike = this.dislikedUsers.find(
    (likedUser) => likedUser._id.toHexString() === user._id
  );

  return isThisUserAlredyPutLike;
};

module.exports = dislikeSchema;
