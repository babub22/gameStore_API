function extractMessageFromJoiError(error) {
  return error.details[0].message;
}

module.exports = extractMessageFromJoiError;
