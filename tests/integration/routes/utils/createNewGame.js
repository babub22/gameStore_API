const { Game } = require("../../../../models/game/game");
const { dateToString } = require("../../../../utils/dateToString");
const createNewDevelover = require("./createNewDevelover");
const createNewGenre = require("./createNewGenre");

async function createNewGame(date) {
  const { newDeveloper } = await createNewDevelover();
  const { newGenre } = await createNewGenre();

  const releaseDate = dateToString(date);

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
