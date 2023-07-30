const express = require("express");
const validateRequestBody = require("../../middleware/validateRequestBody");
const registrationDataValidator = require("../../utils/validators/user/registrationDataValidator");
const loginDataValidator = require("../../utils/validators/user/loginDataValidator");
const auth = require("../../middleware/auth");
const moderator = require("../../middleware/moderator");
const validateRequestParams = require("../../middleware/validateRequestParams");
const objectIdValidator = require("../../utils/validators/objectIdValidator");
const blockingInfoValidator = require("../../utils/validators/user/blockingInfoValidator");
const validateRequestQuery = require("../../middleware/validateRequestQuery");
const usersQueryValidator = require("../../utils/validators/user/usersQueryValidator");
const admin = require("../../middleware/admin");
const changeRoleQueryValidator = require("../../utils/validators/user/changeRoleQueryValidator");
const getAllUsers = require("./handlers/getAllUsers");
const getUser = require("./handlers/getUser");
const changeUserRole = require("./handlers/changeUserRole");
const blockUser = require("./handlers/blockUser");
const singIn = require("./handlers/singIn");
const singUp = require("./handlers/singUp");

const router = express.Router();

router.get("/", [auth, validateRequestQuery(usersQueryValidator)], getAllUsers);

router.get("/:objectId", validateRequestParams(objectIdValidator), getUser);

router.post("/singup", validateRequestBody(registrationDataValidator), singUp);

router.post("/singin", validateRequestBody(loginDataValidator), singIn);

router.put(
  "/:objectId/block",
  [
    auth,
    moderator,
    validateRequestBody(blockingInfoValidator),
    validateRequestParams(objectIdValidator),
  ],
  blockUser
);

router.put(
  "/:objectId/changeRole",
  [
    auth,
    admin,
    validateRequestParams(objectIdValidator),
    validateRequestQuery(changeRoleQueryValidator),
  ],
  changeUserRole
);

module.exports = router;
