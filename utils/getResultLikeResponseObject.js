function getResultObject(isValidRequest, resultBody) {
  return { isValidRequest, resultBody };
}

async function getResultLikeResponseObject({ result: methodResult, errorObject, fn }) {
  if (!methodResult) {
    return getResultObject(false, errorObject);
  }

  await fn?.();

  return getResultObject(true, methodResult);
}

module.exports = getResultLikeResponseObject;
