const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

function dbConnection() {
  const db = config.get("db");
  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
}

module.exports = dbConnection;
