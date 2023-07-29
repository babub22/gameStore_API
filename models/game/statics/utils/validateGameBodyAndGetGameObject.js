const { pick } = require("lodash");
const { dateToString } = require("../../../../utils/dateToString");
const getResultLikeResponseObject = require("../../../../utils/getResultLikeResponseObject");
const { Developer } = require("../../../developer");
const { Genre } = require("../../../genre");
const THIS_DEVELOPER_DOES_NOT_EXISTS = require("../../../../utils/responseObjects/developer/THIS_DEVELOPER_DOES_NOT_EXISTS");
const THIS_GENRE_DOES_NOT_EXISTS = require("../../../../utils/responseObjects/genre/THIS_GENRE_DOES_NOT_EXISTS");

async function validateGameBodyAndGetGameObject({ req }) {
  const { developerId, genreId, releaseDate } = req.body;

  const developer = await Developer.findById(developerId);

  if (!developer) {
    return await getResultLikeResponseObject({
      errorObject: THIS_DEVELOPER_DOES_NOT_EXISTS,
    });
  }

  const genre = await Genre.findById(genreId);

  if (!genre) {
    return await getResultLikeResponseObject({
      errorObject: THIS_GENRE_DOES_NOT_EXISTS,
    });
  }
  const dateString = dateToString(releaseDate);

  const gameInformation = pick(req.body, ["title", "price", "decription"]);

  const newGameObject = {
    ...gameInformation,
    developer,
    genre,
    releaseDate: dateString,
    addedBy: req?.user?.name,
  };

  return getResultLikeResponseObject({ result: { newGameObject } });
}

module.exports = validateGameBodyAndGetGameObject;
