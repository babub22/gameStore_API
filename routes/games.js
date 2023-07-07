const { Game } = require("../models/game");

const route = require("express").Router();

route.get("/", async (req, res) => {
  const games = await Game.find();
  res.send(games);
});

module.exports = route;
