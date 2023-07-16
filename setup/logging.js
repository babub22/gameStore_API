const winston = require("winston");

function logging() {
  if (process.env.NODE_ENV === "test") {
    winston.add(new winston.transports.Console());
    return;
  }

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    })
  );
}

module.exports = logging;
