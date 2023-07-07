const { Genre } = require("../../../../models/genre");

async function createNewGenre() {
  const newGenre = new Genre({
    name: "genre1",
  });

  await newGenre.save();

  const genreId = newGenre._id.toHexString();

  return { genreId, newGenre };
}

module.exports = createNewGenre;
