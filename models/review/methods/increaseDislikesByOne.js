module.exports = function (user) {
  this.dislikesCount += 1;
  this.dislikedUsers.push(user);
};
