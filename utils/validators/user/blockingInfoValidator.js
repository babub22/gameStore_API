const Joi = require("joi");

function blockingInfoValidator(data) {
  const schema = Joi.object({
    reason: Joi.string().required(),
  });

  return schema.validate(data);
}

module.exports = blockingInfoValidator;
