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

const likeSchema = new mongoose.Schema({
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

likeSchema.methods.increaseLikesByOne = function (user) {
  this.likesCount += 1;
  this.likedUsers.push(user);
};

likeSchema.methods.decreaseLikesByOne = function (user) {
  this.likesCount -= 1;
  this.likedUsers.filter(
    (likedUser) => likedUser._id.toHexString() === user._id
  );
};

likeSchema.methods.checkIfThisUserAlreadyPutLike = function (user) {
  const isThisUserAlredyPutLike = this.likedUsers.find(
    (likedUser) => likedUser._id.toHexString() === user._id
  );

  return isThisUserAlredyPutLike;
};

module.exports = likeSchema;
