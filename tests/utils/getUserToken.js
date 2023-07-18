const mongoose = require("mongoose");
const { User } = require("../../models/user/user");

function getUserToken(userId) {
  const objectId = new mongoose.Types.ObjectId();

  const token = new User({
    _id: userId || objectId,
    name: "Vlad",
    isReviewer: false,
  }).generateAuthToken();

  return { token, objectId: objectId.toHexString() };
}

module.exports = getUserToken;
