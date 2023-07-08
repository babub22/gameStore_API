const mongoose = require("mongoose");
const { User } = require("../../models/user");

function getUserToken() {
  const objectId = new mongoose.Types.ObjectId();

  const token = new User({
    _id: objectId,
    name: "Vlad",
    role: "User",
  }).generateAuthToken();

  return { token, objectId: objectId.toHexString() };
}

module.exports = getUserToken;
