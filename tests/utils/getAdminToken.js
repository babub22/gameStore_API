const mongoose = require("mongoose");
const { User } = require("../../models/user/user");

function getAdminToken() {
  const objectId = new mongoose.Types.ObjectId();

  const token = new User({
    _id: objectId,
    name: "Vlad",
    role: "Admin",
    isReviewer: false,
  }).generateAuthToken();

  return { token, objectId: objectId.toHexString() };
}

module.exports = getAdminToken;
