function moderator(req, res, next) {
  if (!["Admin", "Moderator"].includes(req.user.role)) {
    return res.status(403).send("Access denied");
  }

  next();
}

module.exports = moderator;
