const { Game } = require("../../../models/game/game");

async function newGame(req, res) {
  const { isValidRequest, resultBody } = await Game.createNewGame({
    req,
  });

  if (!isValidRequest) {
    const { message, status } = resultBody;
    return res.status(status).send(message);
  }

  res.status(201).send(resultBody.newGame);
}

module.exports = newGame;
