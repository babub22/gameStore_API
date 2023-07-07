const router = require("express").Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validateRequestBody = require("../middleware/validateRequestBody");
const { Developer } = require("../models/developer");
const developerValidator = require("../utils/validators/developer/developerValidator");

router.get("/", async (req, res) => {
  const developers = await Developer.find();

  res.send(developers);
});

router.post(
  "/",
  [auth, admin, validateRequestBody(developerValidator)],
  async (req, res) => {
    const newDeveloper = new Developer(req.body);

    await newDeveloper.save();

    res.send(newDeveloper);
  }
);

module.exports = router;
