const { Game } = require("../../../models/game/game");

async function getGames(_req, res) {
  const games = await Game.find();
  res.send(games);
}

module.exports = getGames;
