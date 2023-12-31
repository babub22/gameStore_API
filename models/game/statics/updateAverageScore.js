const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");

module.exports = async function ({ gameId, averageScore}) {
  const updatedGame = await this.findByIdAndUpdate(
    gameId,
    { averageScore },
    { new: true }
  );

  return getResultLikeResponseObject({
    result: updatedGame,
    errorObject: THIS_GAME_DOES_NOT_EXISTS,
  });
};
