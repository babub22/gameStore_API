const mongoose = require("mongoose");
const config = require("config");

function dbConnection() {
  const db = config.get("db");
  mongoose.connect(db).then(() => console.log(`Connected to ${db}...`));
}

module.exports = dbConnection;
