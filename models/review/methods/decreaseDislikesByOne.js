module.exports = function (user) {
  this.dislikesCount -= this.dislikesCount > 0 && 1;
  this.dislikedUsers = this.dislikedUsers.filter(
    (dislikedUser) => dislikedUser.name !== user.name
  );
};
