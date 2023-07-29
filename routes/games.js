const validateRequestBody = require("../middleware/validateRequestBody");
const { Game } = require("../models/game/game");
const route = require("express").Router();
const gameValidator = require("../utils/validators/game/gameValidator");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Developer } = require("../models/developer");
const { Genre } = require("../models/genre");
const { pick } = require("lodash");
const { dateToString } = require("../utils/dateToString");

route.get("/", async (req, res) => {
  const games = await Game.find();
  res.send(games);
});

route.post(
  "/",
  [auth, admin, validateRequestBody(gameValidator)],
  async (req, res) => {
    const { developerId, genreId, releaseDate } = req.body;

    const developer = await Developer.findById(developerId);

    if (!developer) {
      return res
        .status(404)
        .send("This developer does not exist in the database!");
    }

    const genre = await Genre.findById(genreId);

    if (!genre) {
      return res.status(404).send("This genre does not exist in the database!");
    }

    const dateString = dateToString(releaseDate);

    const gameInformation = pick(req.body, ["title", "price", "decription"]);

    const newGameObject = {
      ...gameInformation,
      developer,
      genre,
      releaseDate: dateString,
      addedBy: req?.user?.name,
    };

    const newGame = new Game(newGameObject);

    await newGame.save();

    res.status(201).send(newGame);
  }
);

module.exports = route;
