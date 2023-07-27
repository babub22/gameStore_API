module.exports = function (gameId) {
  return this.find({
    "game._id": gameId,
  });
};
