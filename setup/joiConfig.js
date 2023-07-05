const Joi = require("joi");

function configJoi() {
  Joi.objectId = require("joi-objectid")(Joi);
}

module.exports = configJoi;
