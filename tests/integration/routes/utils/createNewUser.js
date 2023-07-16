const { User } = require("../../../../models/user/user");
const getHashedString = require("../../../../utils/bcrypt/getHashedString");

const validUserData = {
  name: "newUser",
  email: "example@gmail.com",
  password: "1234",
};

async function createNewUser() {
  const hashedPassword = await getHashedString(validUserData.password);
  const newUser = new User({ ...validUserData, password: hashedPassword });

  await newUser.save();

  const userId = newUser._id.toHexString();

  return { userId, newUser };
}

module.exports = { validUserData, createNewUser };
