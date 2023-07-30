const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_GAME_ALREADY_EXISTS = require("../../../utils/responseObjects/games/THIS_GAME_ALREADY_EXISTS");
const validateGameBodyAndGetGameObject = require("./utils/validateGameBodyAndGetGameObject");

module.exports = async function ({ req }) {
  const { isValidRequest, resultBody } = await validateGameBodyAndGetGameObject(
    { req }
  );

  if (!isValidRequest) {
    return await getResultLikeResponseObject({
      errorObject: resultBody,
    });
  }

  const isGameAlreadyExist = await this.exists({ title: req.body.title });

  if (isGameAlreadyExist) {
    return await getResultLikeResponseObject({
      errorObject: THIS_GAME_ALREADY_EXISTS,
    });
  }

  const newGame = new this(resultBody.newGameObject);

  async function saveNewGame() {
    await newGame.save();
  }

  return getResultLikeResponseObject({
    result: {
      newGame,
    },
    fn: saveNewGame,
  });
};
