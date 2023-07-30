const router = require("express").Router();
const { Genre } = require("../models/genre");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const validateRequestBody = require("../middleware/validateRequestBody");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const genreValidator = require("../utils/validators/genre/genreValidator");
const validateRequestParams = require("../middleware/validateRequestParams");
const THIS_GENRE_DOES_NOT_EXISTS = require("../utils/responseObjects/genre/THIS_GENRE_DOES_NOT_EXISTS");
const THIS_GENRE_ALREADY_EXISTS = require("../utils/responseObjects/genre/THIS_GENRE_ALREADY_EXISTS");

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

    const isGenreAlreadyExist = await Genre.exists(req.body);

    if (isGenreAlreadyExist) {
      const { status, message } = THIS_GENRE_ALREADY_EXISTS;
      return res.status(status).send(message);
    }

    await newGenre.save();

    res.status(201).send(newGenre);
  }
);

router.put(
  "/:objectId",
  [
    auth,
    admin,
    validateRequestParams(objectIdValidator),
    validateRequestBody(genreValidator),
  ],
  async (req, res) => {
    const { objectId: genreId } = req.params;

    const updatedDeveloper = await Genre.findByIdAndUpdate(genreId, req.body, {
      new: true,
    });

    if (!updatedDeveloper) {
      const { status, message } = THIS_GENRE_DOES_NOT_EXISTS;
      return res.status(status).send(message);
    }

    res.send(updatedDeveloper);
  }
);

router.delete(
  "/:objectId",
  [auth, admin, validateRequestParams(objectIdValidator)],
  async (req, res) => {
    const { objectId: genreId } = req.params;

    const deletedGenre = await Genre.findByIdAndDelete(genreId);

    if (!deletedGenre) {
      const { status, message } = THIS_GENRE_DOES_NOT_EXISTS;
      return res.status(status).send(message);
    }

    res.send(deletedGenre);
  }
);

module.exports = router;
