const { Game } = require("../../../models/game/game");

async function changeGame(req, res) {
  const { objectId: gameId } = req.params;

  const { isValidRequest, resultBody } = await Game.updateGame({ gameId, req });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.send(resultBody.updatedGame);
}

module.exports = changeGame;
