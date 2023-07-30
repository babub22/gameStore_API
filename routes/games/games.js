const validateRequestBody = require("../../middleware/validateRequestBody");
const router = require("express").Router();
const gameValidator = require("../../utils/validators/game/gameValidator");
const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");
const getGame = require("./handlers/getGame");
const validateRequestParams = require("../../middleware/validateRequestParams");
const objectIdValidator = require("../../utils/validators/objectIdValidator");
const getGames = require("./handlers/getGames");
const newGame = require("./handlers/newGame");
const changeGame = require("./handlers/changeGame");
const deleteGame = require("./handlers/deleteGame");

router.get("/", getGames);

router.get("/:objectId", validateRequestParams(objectIdValidator), getGame);

router.post("/", [auth, admin, validateRequestBody(gameValidator)], newGame);

router.put(
  "/:objectId",
  [
    auth,
    admin,
    validateRequestParams(objectIdValidator),
    validateRequestBody(gameValidator),
  ],
  changeGame
);

router.delete(
  "/:objectId",
  [auth, admin, validateRequestParams(objectIdValidator)],
  deleteGame
);

module.exports = router;
