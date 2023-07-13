function getHeaderObject(token) {
  return { header: jest.fn().mockReturnValue(token) };
}

module.exports = getHeaderObject;
