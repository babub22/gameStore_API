const router = require("express").Router();
const { Genre } = require("../models/genre");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const validateRequestBody = require("../middleware/validateRequestBody");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const genreValidator = require("../utils/validators/genre/genreValidator");
const validateRequestParams = require("../middleware/validateRequestParams");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get(
  "/:objectId",
  validateRequestParams(objectIdValidator),
  async (req, res) => {
    const { objectId: genreId } = req.params;

    const genres = await Genre.findById(genreId);

    if (!genres) {
      return res.status(404).send("Genre with the specified ID was not found!");
    }

    res.send(genres);
  }
);

router.post(
  "/",
  [auth, admin, validateRequestBody(genreValidator)],
  async (req, res) => {
    const newGenre = new Genre(req.body);

    await newGenre.save();

    res.send(newGenre);
  }
);

module.exports = router;
