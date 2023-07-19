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
const validateRequestQuery = require("../middleware/validateRequestQuery");
const GETAllUsersQueryValidator = require("../utils/validators/user/GET_allUsersQueryValidator");
const admin = require("../middleware/admin");
const changeRoleQueryValidator = require("../utils/validators/user/changeRoleQueryValidator");

const router = express.Router();

router.get(
  "/",
  [auth, validateRequestQuery(GETAllUsersQueryValidator)],
  async (req, res) => {
    const { sortBy, limit, role } = req.query;

    let query = {
      "userStatus.status": "Active",
    };

    if (role === "Reviewer") {
      query.isReviewer = true;
    } else if (role) {
      query.role = role;
    }

    let sortedUsers;

    if (sortBy === "reviewsCount") {
      sortedUsers = await User.find(query)
        .limit(Number(limit))
        .sort(`-${sortBy}`);
    } else {
      sortedUsers = await User.find(query)
        .limit(Number(limit))
        .sort(`${sortBy}`);
    }

    res.send(sortedUsers);
  }
);

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

router.put(
  "/:objectId/block",
  [
    auth,
    moderator,
    validateRequestBody(blockingInfoValidator),
    validateRequestParams(objectIdValidator),
  ],
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

router.put(
  "/:objectId/changeRole",
  [
    auth,
    admin,
    validateRequestParams(objectIdValidator),
    validateRequestQuery(changeRoleQueryValidator),
  ],
  async (req, res) => {
    const { objectId: userId } = req.params;
    const { role: newRole } = req.query;

    const { isValidRequest, resultBody } = await User.changeRoleById({
      userId,
      newRole,
    });

    if (!isValidRequest) {
      const { message, status } = resultBody;
      return res.status(status).send(message);
    }

    res.send(resultBody);
  }
);

module.exports = router;
