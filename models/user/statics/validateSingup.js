const { pick } = require("lodash");
const getHashedString = require("../../../utils/bcrypt/getHashedString");
const getResultObject = require("../../../utils/getResultObject");

module.exports = async function (singupData) {
  const { email, password } = singupData;
  let result;

  const user = await this.findOne({ email });

  if (user) {
    result = getResultObject(false, {
      status: 400,
      message: "This user already exist!",
    });

    return result;
  }

  const hashedPassword = await getHashedString(password);

  const newUser = new this({
    ...singupData,
    password: hashedPassword,
  });

  await newUser.save();

  const token = newUser.generateAuthToken();

  result = getResultObject(true, {
    token,
    newUser: pick(newUser, ["_id", "name", "email"]),
  });
  return result;
};
