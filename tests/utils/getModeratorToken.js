const mongoose = require("mongoose");
const { User } = require("../../models/user/user");

function getModeratorToken() {
  const objectId = new mongoose.Types.ObjectId();

  const token = new User({
    _id: objectId,
    name: "Vlad",
    role: "Moderator",
    isReviewer: false,
  }).generateAuthToken();

  return { token, objectId: objectId.toHexString() };
}

module.exports = getModeratorToken;
