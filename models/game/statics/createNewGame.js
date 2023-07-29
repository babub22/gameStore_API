const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
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
