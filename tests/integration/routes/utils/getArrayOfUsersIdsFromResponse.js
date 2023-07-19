function getArrayOfUsersIdsFromResponse({ body }) {
  return body.map((user) => user._id);
}

module.exports = getArrayOfUsersIdsFromResponse;
