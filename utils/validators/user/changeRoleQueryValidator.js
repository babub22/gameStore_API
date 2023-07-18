const Joi = require("joi");

const PROMOTION_REGEX = /^Admin$|^Moderator$|^User$/;

function changeRoleQueryValidator(review) {
  const schema = Joi.object({
    role: Joi.string().regex(PROMOTION_REGEX).required(),
  });

  return schema.validate(review);
}

module.exports = changeRoleQueryValidator;
