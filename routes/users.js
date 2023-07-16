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
    const { isValidRequest, resultBody } = await User.validateSingup(req.body);

    if (!isValidRequest) {
      const { message, status } = resultBody;
      return res.status(status).send(message);
    }

    res.header("x-auth-token", resultBody.token).send(resultBody.newUser);
  }
);

router.post(
  "/singin",
  validateRequestBody(loginDataValidator),
  async (req, res) => {
    const { isValidRequest, resultBody } = await User.validateSignin(req.body);

    if (!isValidRequest) {
      const { message, status } = resultBody;
      return res.status(status).send(message);
    }

    res
      .header("x-auth-token", resultBody.token)
      .send(`Welcome ${resultBody.name}!`);
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

    const { isValidRequest, resultBody } = await User.blockUserById({
      userId,
      reason,
      currentUser,
    });

    if (!isValidRequest) {
      const { message, status } = resultBody;
      return res.status(status).send(message);
    }

    res.send(resultBody);
  }
);

module.exports = router;
