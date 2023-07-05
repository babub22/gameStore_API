const app = require("express")();

require("./setup/dbConnection")();
require("./setup/routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;
