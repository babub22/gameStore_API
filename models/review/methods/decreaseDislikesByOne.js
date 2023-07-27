module.exports = function (user) {
  this.dislikesCount -= 1;
  this.dislikedUsers.filter(
    (likedUser) => likedUser._id.toHexString() === user._id
  );
};
