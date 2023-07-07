const express = require("express");
const genres = require("../routes/genres");
const users = require("../routes/users");
const developers = require("../routes/developers");

function routes(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/users", users);
  app.use("/api/developers", developers);
}
users;

module.exports = routes;
