function validateRequestParams(validator) {
  return (req, res, next) => {
    const { error } = validator(req.params);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    next();
  };
}

module.exports = validateRequestParams;
