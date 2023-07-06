const Joi = require("joi");

function genreValidator(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = genreValidator;
