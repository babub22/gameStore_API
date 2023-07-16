const mongoose = require("mongoose");

function dbDisconnection() {
  mongoose.disconnect();
}

module.exports = dbDisconnection;
