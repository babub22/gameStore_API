const Joi = require("joi");

function reviewPUTValidator(review) {
  const schema = Joi.object({
    text: Joi.string().min(3).required(),
    gameScore: Joi.number().min(0).max(10).required(),
  });

  return schema.validate(review);
}

module.exports = reviewPUTValidator;
