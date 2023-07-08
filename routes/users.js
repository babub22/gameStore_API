const express = require("express");
const validateRequestBody = require("../middleware/validateRequestBody");
const registrationDataValidator = require("../utils/validators/user/registrationDataValidator");
const { User } = require("../models/user");
const getHashedString = require("../utils/bcrypt/getHashedString");
const { pick } = require("lodash");
const loginDataValidator = require("../utils/validators/user/loginDataValidator");
const compareHashedStrings = require("../utils/bcrypt/compareHashedStrings");

const router = express.Router();

router.post(
  "/singup",
  validateRequestBody(registrationDataValidator),
  async (req, res) => {
    const user = await User.findOne(pick(req.body, ["email", "name"]));

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
      .send(pick(newUser, ["_id", "name", "email"]));
  }
);

router.post(
  "/singin",
  validateRequestBody(loginDataValidator),
  async (req, res) => {
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User with this mail doesnt exist!");
    }

    const isValidPassword = await compareHashedStrings(password, user.password);

    if (!isValidPassword) {
      return res.status(404).send("Password is wrong!");
    }

    const token = await user.generateAuthToken();

    res.header("x-auth-token", token).send(`Welcome ${user.name}!`);
  }
);

module.exports = router;
