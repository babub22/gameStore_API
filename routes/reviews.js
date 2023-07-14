const { Review } = require("../models/review");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const router = require("express").Router();
const validateRequestParams = require("../middleware/validateRequestParams");
const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const reviewValidator = require("../utils/validators/review/reviewValidator");
const validateRequestBody = require("../middleware/validateRequestBody");
const reviewPUTValidator = require("../utils/validators/review/PUTreviewValidator");

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
      return res.status(404).send("This game does not exist!");
    }

    const newReview = new Review({
      ...req.body,
      author: { ...req.user },
      game,
    });

    await newReview.save();

    res.status(201).send(newReview);
  }
);

router.put(
  "/:objectId",
  [
    auth,
    validateRequestParams(objectIdValidator),
    validateRequestBody(reviewPUTValidator),
  ],
  async (req, res) => {
    const { objectId: reviewId } = req.params;

    const response = await Review.checkIfProvidedUserWroteThisReview(
      reviewId,
      req.user
    );

    if (response) {
      const { status, message } = response;
      return res.status(status).send(message);
    }

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });

    res.send(updatedReview);
  }
);

module.exports = router;
