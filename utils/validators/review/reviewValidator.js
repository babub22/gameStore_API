const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

function reviewValidator(review) {
  const schema = Joi.object({
    gameId: Joi.objectId().required(),
    text: Joi.string().min(3).required(),
    gameScore: Joi.number().min(0).max(10).required(),
  });

  return schema.validate(review);
}

module.exports = reviewValidator;
