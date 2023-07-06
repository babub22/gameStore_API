const winston = require("winston");

function logging() {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    })
  );
}

module.exports = logging;
