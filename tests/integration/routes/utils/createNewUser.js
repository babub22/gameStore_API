const { User } = require("../../../../models/user/user");
const getHashedString = require("../../../../utils/bcrypt/getHashedString");

const validUserData = {
  name: "newUser",
  email: "example@gmail.com",
  password: "1234",
};

async function createNewUser(userData = validUserData) {
  const hashedPassword = await getHashedString(userData.password);
  const newUser = new User({ ...userData, password: hashedPassword });

  await newUser.save();

  const userId = newUser._id.toHexString();

  return { userId, newUser };
}

module.exports = { validUserData, createNewUser };
