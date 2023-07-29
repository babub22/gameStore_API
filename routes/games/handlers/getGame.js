const { Game } = require("../../../models/game/game");
const THIS_GAME_DOES_NOT_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_DOES_NOT_EXISTS");

async function getGame(req, res) {
  const { objectId: gameId } = req.params;

  const game = await Game.findById(gameId, { lean: true });

  if (!game) {
    const { message, status } = THIS_GAME_DOES_NOT_EXISTS;
    return res.status(status).send(message);
  }

  res.send(game);
}

module.exports = getGame;
