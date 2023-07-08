const Joi = require("joi");

function registrationDataValidator(data) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(3),
  });

  return schema.validate(data);
}

module.exports = registrationDataValidator;
