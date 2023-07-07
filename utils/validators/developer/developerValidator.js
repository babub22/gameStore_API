const Joi = require("joi");

function developerValidator(developer) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });

  return schema.validate(developer);
}

module.exports = developerValidator;
