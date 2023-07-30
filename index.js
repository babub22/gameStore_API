const app = require("express")();
const winston = require("winston");

require("./setup/logging")();
require("./setup/dbConnection")();
require("./setup/routes")(app);
require("./setup/swagger")(app);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  winston.info(`Running on port ${PORT}`);
});

module.exports = server;
