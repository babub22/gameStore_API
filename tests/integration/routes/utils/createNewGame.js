const { Game } = require("../../../../models/game");
const { stringToDate } = require("../../../../utils/stringToDate");
const createNewDevelover = require("./createNewDevelover");
const createNewGenre = require("./createNewGenre");

async function createNewGame() {
  const { newDeveloper } = await createNewDevelover();
  const { newGenre } = await createNewGenre();

  const releaseDate = stringToDate("30/05/1995");

  const newGame = new Game({
    title: "Game title",
    price: 20,
    releaseDate,
    description: new Array(26).join("a"),
    genre: newGenre,
    developer: newDeveloper,
  });

  await newGame.save();
  const gameId = newGame._id.toHexString();

  return { gameId, newGame };
}

module.exports = createNewGame;
