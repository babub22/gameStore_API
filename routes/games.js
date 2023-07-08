const validateRequestBody = require("../middleware/validateRequestBody");
const { Game } = require("../models/game");
const route = require("express").Router();
const gameValidator = require("../utils/validators/game/gameValidator");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Developer } = require("../models/developer");
const { Genre } = require("../models/genre");
const { stringToDate } = require("../utils/stringToDate");
const { pick } = require("lodash");

route.get("/", async (req, res) => {
  const games = await Game.find();
  res.send(games);
});

route.post(
  "/",
  [auth, admin, validateRequestBody(gameValidator)],
  async (req, res) => {
    const { developerId, genreId, gameReleaseDate } = req.body;

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

    const date = stringToDate(gameReleaseDate);

    if (!date) {
      return res.status(400).send("Provided date is not valid!");
    }

    const gameProperties = pick(req.body, ["title", "price", "decription"]);

    const addedBy = req?.user?.name;

    const newGame = new Game({
      ...gameProperties,
      developer,
      genre,
      gameReleaseDate: date,
      addedBy,
    });

    await newGame.save();

    res.send(newGame);
  }
);

module.exports = route;
