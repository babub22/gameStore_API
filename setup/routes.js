const express = require("express");
const genres = require("../routes/genres");
const users = require("../routes/users/users");
const developers = require("../routes/developers");
const games = require("../routes/games");
const reviews = require("../routes/reviews");

function routes(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/users", users);
  app.use("/api/developers", developers);
  app.use("/api/games", games);
  app.use("/api/reviews", reviews);
}

module.exports = routes;
