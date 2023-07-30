module.exports = function (user) {
  this.likesCount -= this.likesCount > 0 && 1;
  this.likedUsers = this.likedUsers.filter(
    (likedUser) => likedUser.name !== user.name
  );
};
