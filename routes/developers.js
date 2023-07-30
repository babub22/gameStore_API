const router = require("express").Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validateRequestBody = require("../middleware/validateRequestBody");
const validateRequestParams = require("../middleware/validateRequestParams");
const { Developer } = require("../models/developer");
const THIS_DEVELOPER_ALREADY_EXISTS = require("../utils/responseObjects/developer/THIS_DEVELOPER_ALREADY_EXISTS");
const THIS_DEVELOPER_DOES_NOT_EXISTS = require("../utils/responseObjects/developer/THIS_DEVELOPER_DOES_NOT_EXISTS");
const developerValidator = require("../utils/validators/developer/developerValidator");
const objectIdValidator = require("../utils/validators/objectIdValidator");

router.get("/", async (_req, res) => {
  const developers = await Developer.find();

  res.send(developers);
});

router.post(
  "/",
  [auth, admin, validateRequestBody(developerValidator)],
  async (req, res) => {
    const newDeveloper = new Developer(req.body);

    const isDeveloperAlreadyExist = await Developer.exists(req.body);

    if (isDeveloperAlreadyExist) {
      const { status, message } = THIS_DEVELOPER_ALREADY_EXISTS;
      return res.status(status).send(message);
    }

    await newDeveloper.save();

    res.status(201).send(newDeveloper);
  }
);

router.put(
  "/:objectId",
  [
    auth,
    admin,
    validateRequestParams(objectIdValidator),
    validateRequestBody(developerValidator),
  ],
  async (req, res) => {
    const { objectId: developerId } = req.params;

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      req.body,
      { new: true }
    );

    if (!updatedDeveloper) {
      const { status, message } = THIS_DEVELOPER_DOES_NOT_EXISTS;
      return res.status(status).send(message);
    }

    res.send(updatedDeveloper);
  }
);

module.exports = router;
