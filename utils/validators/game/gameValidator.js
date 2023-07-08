const Joi = require("joi");
const { VALID_DATE_FORMAT } = require("../../stringToDate");

function gameValidator(game) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    gameReleaseDate: Joi.string().pattern(VALID_DATE_FORMAT).required(),
    description: Joi.string().min(25).required(),
    developerId: Joi.objectId().required(),
    genreId: Joi.objectId().required(),
  });

  return schema.validate(game);
}

module.exports = gameValidator;
