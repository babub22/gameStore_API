const Joi = require("joi");

function objectIdValidator(body) {
  const schema = Joi.object({
    objectId: Joi.objectId().required(),
  });

  return schema.validate(body);
}

module.exports = objectIdValidator;
