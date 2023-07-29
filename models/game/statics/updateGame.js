const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const validateGameBodyAndGetGameObject = require("./utils/validateGameBodyAndGetGameObject");

module.exports = async function ({ gameId, req }) {
  const { isValidRequest, resultBody } = await validateGameBodyAndGetGameObject(
    { req }
  );

  if (!isValidRequest) {
    return await getResultLikeResponseObject({
      errorObject: resultBody,
    });
  }

  resultBody.newGameObject.updateDate = Date.now();

  const updatedGame = await this.findByIdAndUpdate(
    gameId,
    resultBody.newGameObject,
    {
      new: true,
    }
  );

  return getResultLikeResponseObject({
    result: {
      updatedGame,
    },
  });
};
