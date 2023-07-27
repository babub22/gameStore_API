module.exports = function (gameId) {
  return this.find({
    "author._id": gameId,
  });
};
