const express = require("express");
const validateRequestBody = require("../middleware/validateRequestBody");
const registrationDataValidator = require("../utils/validators/user/registrationDataValidator");
const { User } = require("../models/user");
const getHashedString = require("../utils/bcrypt/getHashedString");
const { pick } = require("lodash");

const router = express.Router();

router.post(
  "/singup",
  validateRequestBody(registrationDataValidator),
  async (req, res) => {
    const user = await User.findOne(pick(req.body, ["email", "username"]));

    if (user) {
      return res.status(400).send("This user already exist!");
    }

    const { password } = req.body;
    const heshedPassword = await getHashedString(password);

    const newUser = new User({
      ...req.body,
      password: heshedPassword,
    });

    await newUser.save();

    const token = newUser.generateAuthToken();

    res
      .header("x-auth-token", token)
      .send(pick(newUser, ["_id", "username", "email"]));
  }
);

module.exports = router;
