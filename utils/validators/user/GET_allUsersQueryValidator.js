const Joi = require("joi");

const SORTBY_REGEX = /^name$|^role$|^reviewsCount$/;
const ROLE_REGEX = /^Admin$|^Reviewer$|^Moderator$|^User$/;

function getAllUsersQueryValidator(review) {
  const schema = Joi.object({
    limit: Joi.number().min(2),
    sortBy: Joi.string().regex(SORTBY_REGEX),
    role: Joi.string().regex(ROLE_REGEX),
  });

  return schema.validate(review);
}

module.exports = getAllUsersQueryValidator;
