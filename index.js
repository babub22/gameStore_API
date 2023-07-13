const app = require("express")();
const winston = require("winston");

require("./setup/dbConnection")();
require("./setup/routes")(app);
require("./setup/logging")();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  winston.info(`Running on port ${PORT}`);
});

module.exports = app;
