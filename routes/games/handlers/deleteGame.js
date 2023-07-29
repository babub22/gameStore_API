const { Game } = require("../../../models/game/game");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");

async function deleteGame(req, res) {
  const { objectId: gameId } = req.params;

  const deletedGame = await Game.findByIdAndDelete(gameId);

  if (!deletedGame) {
    const { message, status } = THIS_GAME_DOES_NOT_EXISTS;
    return res.status(status).send(message);
  }

  res.status(200).send(deletedGame);
}

module.exports = deleteGame;
