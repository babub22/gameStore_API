const { Game } = require("../../../../models/game/game");
const { dateToString } = require("../../../../utils/dateToString");
const createNewDeveloper = require("./createNewDeveloper");
const createNewGenre = require("./createNewGenre");

const fakeDate = Date.parse("1995-05-30");

async function createNewGame() {
  const newGameObject = await getNewGameObject();

  const newGame = new Game(newGameObject);

  await newGame.save();

  const gameId = newGame._id.toHexString();

  return { gameId, newGame };
}

async function getNewGameObject(
  gameBody = { title: "Game title", price: 20, description: "a".repeat(26) },
  developerName,
  genreName
) {
  const { newDeveloper } = await createNewDeveloper(developerName);
  const { newGenre } = await createNewGenre(genreName);

  const releaseDate = dateToString(fakeDate);

  return {
    ...gameBody,
    releaseDate,
    genre: newGenre,
    developer: newDeveloper,
  };
}

module.exports = { createNewGame, fakeDate, getNewGameObject };
