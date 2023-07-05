const router = require("express").Router();
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

module.exports = router;
