function getMiddlewareParams(req) {
  const next = jest.fn();

  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return { req, res, next };
}

module.exports = getMiddlewareParams;
