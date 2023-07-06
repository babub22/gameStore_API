const app = require("express")();

require("./setup/dbConnection")();
require("./setup/routes")(app);
require("./setup/joiConfig")();
require("./setup/logging")();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;
