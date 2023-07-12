const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

function objectIdValidator(body) {
  const schema = Joi.object({
    objectId: Joi.objectId().required(),
  });

  return schema.validate(body);
}

module.exports = objectIdValidator;
