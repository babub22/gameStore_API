const objectIdValidator = require("../../utils/validators/objectIdValidator");
const router = require("express").Router();
const validateRequestParams = require("../../middleware/validateRequestParams");
const auth = require("../../middleware/auth");
const reviewValidator = require("../../utils/validators/review/reviewValidator");
const validateRequestBody = require("../../middleware/validateRequestBody");
const PUT_reviewValidator = require("../../utils/validators/review/PUT_reviewValidator");
const reviewsByGame = require("./handlers/reviewByGame");
const reviewByAuthor = require("./handlers/reviewByAuthor");
const newReview = require("./handlers/newReview");
const changeReview = require("./handlers/changeReview");
const deleteReview = require("./handlers/deleteReview");
const likeReview = require("./handlers/likeReview");
const dislikeReview = require("./handlers/dislikeReview");

router.get(
  "/game/:objectId",
  validateRequestParams(objectIdValidator),
  reviewsByGame
);

router.get(
  "/author/:objectId",
  validateRequestParams(objectIdValidator),
  reviewByAuthor
);

router.post(
  "/:objectId",
  [
    auth,
    validateRequestParams(objectIdValidator),
    validateRequestBody(reviewValidator),
  ],
  newReview
);

router.put(
  "/:objectId",
  [
    auth,
    validateRequestParams(objectIdValidator),
    validateRequestBody(PUT_reviewValidator),
  ],
  changeReview
);

router.delete(
  "/:objectId",
  [auth, validateRequestParams(objectIdValidator)],
  deleteReview
);

router.post(
  "/:objectId/like",
  [auth, validateRequestParams(objectIdValidator)],
  likeReview
);

router.post(
  "/:objectId/dislike",
  [auth, validateRequestParams(objectIdValidator)],
  dislikeReview
);

module.exports = router;
