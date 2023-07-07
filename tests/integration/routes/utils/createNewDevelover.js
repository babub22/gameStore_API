const { Developer } = require("../../../../models/developer");

async function createNewDevelover() {
  const newDeveloper = new Developer({
    name: "developer1",
  });

  await newDeveloper.save();

  const developerId = newDeveloper._id.toHexString();

  return { developerId, newDeveloper };
}

module.exports = createNewDevelover;
