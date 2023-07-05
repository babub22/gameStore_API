const express = require("express");
const genres = require("../routes/genres");

function routes(app) {
  app.use(express.json());
  app.use("/api/genres", genres);
}

module.exports = routes;
