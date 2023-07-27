const mongoose = require("mongoose");
const increaseLikesByOne = require("./methods/increaseLikesByOne");
const decreaseLikesByOne = require("./methods/decreaseLikesByOne");

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

likeSchema.methods.increaseLikesByOne = increaseLikesByOne;
likeSchema.methods.decreaseLikesByOne = decreaseLikesByOne;

likeSchema.methods.checkIfThisUserAlreadyPutLike = function (user) {
  const isThisUserAlredyPutLike = this.likedUsers.find(
    (likedUser) => likedUser._id.toHexString() === user._id
  );

  return isThisUserAlredyPutLike;
};

module.exports = likeSchema;
