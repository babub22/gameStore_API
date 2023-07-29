const createNewDevelover = require("./createNewDevelover");
const { fakeDate } = require("./createNewGame");
const createNewGenre = require("./createNewGenre");

async function getValidNewGameRequestBody() {
  const { developerId } = await createNewDevelover();
  const { genreId } = await createNewGenre();

  const validNewGameRequestBody = {
    title: "Game title",
    price: 20,
    releaseDate: fakeDate,
    description: new Array(26).join("a"),
    developerId,
    genreId,
  };

  return validNewGameRequestBody;
}

module.exports = getValidNewGameRequestBody;
