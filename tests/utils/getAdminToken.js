const mongoose = require("mongoose");
const { User } = require("../../models/user");

function getAdminToken() {
  const objectId = new mongoose.Types.ObjectId();

  const token = new User({
    _id: objectId,
    username: "Vlad",
    role: "Admin",
  }).generateAuthToken();

  return { token, objectId: objectId.toHexString() };
}

module.exports = getAdminToken;
