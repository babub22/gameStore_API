const Joi = require("joi");

function PUT_gameValidator(review) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    releaseDate: Joi.date().required(),
    description: Joi.string().min(25).required(),
    developerId: Joi.objectId().required(),
    genreId: Joi.objectId().required(),
  });

  return schema.validate(review);
}

module.exports = PUT_gameValidator;
