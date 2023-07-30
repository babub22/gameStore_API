module.exports = function ({ query: { find, limit, sortBy } }) {
  return this.find(find).limit(limit).sort(sortBy).select("-password");
};
