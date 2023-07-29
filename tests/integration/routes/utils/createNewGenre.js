const { Genre } = require("../../../../models/genre");

async function createNewGenre(name = "genre1") {
  const newGenre = new Genre({
    name,
  });

  await newGenre.save();

  const genreId = newGenre._id.toHexString();

  return { genreId, newGenre };
}

module.exports = createNewGenre;
