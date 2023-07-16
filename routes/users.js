const express = require("express");
const validateRequestBody = require("../middleware/validateRequestBody");
const registrationDataValidator = require("../utils/validators/user/registrationDataValidator");
const { User } = require("../models/user/user");
const loginDataValidator = require("../utils/validators/user/loginDataValidator");
const auth = require("../middleware/auth");
const moderator = require("../middleware/moderator");
const validateRequestParams = require("../middleware/validateRequestParams");
const objectIdValidator = require("../utils/validators/objectIdValidator");
const blockingInfoValidator = require("../utils/validators/user/blockingInfoValidator");

const router = express.Router();

router.post(
  "/singup",
  validateRequestBody(registrationDataValidator),
  async (req, res) => {
    const response = await User.validateSingup(req.body);

    if (!response?.token) {
      const { status, message } = response;
      return res.status(status).send(message);
    }

    res.header("x-auth-token", response.token).send(response.newUser);
  }
);

router.post(
  "/singin",
  validateRequestBody(loginDataValidator),
  async (req, res) => {
    const response = await User.validateSignin(req.body);

    if (!response?.token) {
      const { status, message } = response;
      return res.status(status).send(message);
    }

    res
      .header("x-auth-token", response.token)
      .send(`Welcome ${response.name}!`);
  }
);

router.post(
  "/:objectId/block",
  auth,
  moderator,
  validateRequestBody(blockingInfoValidator),
  validateRequestParams(objectIdValidator),
  async (req, res) => {
    const { objectId: userId } = req.params;
    const { reason } = req.body;
    const currentUser = req.user;

    const { isValidRequest, body } = await User.blockUserById({
      userId,
      reason,
      currentUser,
    });

    if (!isValidRequest) {
      const { message, status } = body;
      return res.status(status).send(message);
    }

    res.send(body.user);
  }
);

module.exports = router;
