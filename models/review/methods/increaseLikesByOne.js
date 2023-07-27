module.exports = function (user) {
  this.likesCount += 1;
  this.likedUsers.push(user);
};
