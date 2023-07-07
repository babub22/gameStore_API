const express = require("express");
const genres = require("../routes/genres");
const users = require("../routes/users");
const developers = require("../routes/developers");
const games = require("../routes/games");

function routes(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/users", users);
  app.use("/api/developers", developers);
  app.use("/api/games", games);
}

module.exports = routes;
