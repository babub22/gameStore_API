const { Review } = require("../models/review");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const router = require("express").Router();
const validateRequestParams = require("../middleware/validateRequestParams");
const auth = require("../middleware/auth");
const { Game } = require("../models/game");
const reviewValidator = require("../utils/validators/review/reviewValidator");
const validateRequestBody = require("../middleware/validateRequestBody");
const reviewPUTValidator = require("../utils/validators/review/PUTreviewValidator");
const isAdminOrModeratorRole = require("../utils/isAdminOrModeratorRole");
const { isEqual } = require("lodash");

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

    res.send(newReview);
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

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send("This review does not exist!");
    }

    const isUserRole = !isAdminOrModeratorRole(req.user.role);

    const authorId = review.author._id.toHexString();
    const { _id: userId } = req.user;

    const isSameAuthorAndUserInRequest = isEqual(authorId, userId);

    if (!isSameAuthorAndUserInRequest && isUserRole) {
      return res
        .status(403)
        .send("You dont have permission to change this review!");
    }

    const updated = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });

    res.send(updated);
  }
);

module.exports = router;
