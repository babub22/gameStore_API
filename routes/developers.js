const router = require("express").Router();
const { Developer } = require("../models/developer");

router.get("/", async (req, res) => {
  const developers = await Developer.find();

  res.send(developers);
});

module.exports = router;
