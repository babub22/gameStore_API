const { Developer } = require("../../../../models/developer");

async function createNewDeveloper(name = "developer1") {
  const newDeveloper = new Developer({
    name,
  });

  await newDeveloper.save();

  const developerId = newDeveloper._id.toHexString();

  return { developerId, newDeveloper };
}

module.exports = createNewDeveloper;
