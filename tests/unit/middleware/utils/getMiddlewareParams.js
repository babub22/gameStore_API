function getMiddlewareParams(token) {
  const req = { header: jest.fn().mockReturnValue(token) };

  const next = jest.fn();

  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return { req, res, next };
}

module.exports = getMiddlewareParams;
