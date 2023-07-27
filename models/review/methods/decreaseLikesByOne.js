module.exports = function (user) {
  this.likesCount -= 1;
  this.likedUsers.filter(
    (likedUser) => likedUser._id.toHexString() === user._id
  );
};
