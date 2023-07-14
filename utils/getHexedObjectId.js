const mongoose = require("mongoose");

function getHexedObjectId() {
  return new mongoose.Types.ObjectId().toHexString();
}

module.exports = getHexedObjectId;
