const { Review } = require("../models/review");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const router = require("express").Router();
const validateRequestParams = require("../middleware/validateRequestParams");

router.get(
  "/game/:objectId",
  validateRequestParams(objectIdValidator),
  async (req, res) => {
    const { objectId: gameId } = req.params;

    const reviews = await Review.getReviewsByGameId(gameId);
    res.send(reviews);
  }
);

module.exports = router;
