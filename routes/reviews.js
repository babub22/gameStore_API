const { Review } = require("../models/review");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const router = require("express").Router();
const validateRequestParams = require("../middleware/validateRequestParams");
const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const reviewValidator = require("../utils/validators/review/reviewValidator");
const validateRequestBody = require("../middleware/validateRequestBody");

router.get(
  "/game/:objectId",
  validateRequestParams(objectIdValidator),
  async (req, res) => {
    const { objectId: gameId } = req.params;

    const reviews = await Review.getReviewsByGameId(gameId);
    res.send(reviews);
  }
);

router.get(
  "/author/:objectId",
  validateRequestParams(objectIdValidator),
  async (req, res) => {
    const { objectId: authorId } = req.params;

    const reviews = await Review.getReviewsByAuthorId(authorId);
    res.send(reviews);
  }
);

router.post(
  "/",
  [auth, validateRequestBody(reviewValidator)],
  async (req, res) => {
    const { gameId } = req.body;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).send("This game does not exist in the database!");
    }

    const newReview = new Review({
      ...req.body,
      author: { ...req.user },
      game,
    });

    await newReview.save();

    res.send(newReview);
  }
);

module.exports = router;
