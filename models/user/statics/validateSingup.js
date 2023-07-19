const { omit } = require("lodash");
const getHashedString = require("../../../utils/bcrypt/getHashedString");
const getResultLikeResponseObject = require("../../../utils/getResultLikeResponseObject");
const THIS_USER_ALREADY_EXISTS = require("../../../utils/responseObjects/users/THIS_USER_ALREADY_EXISTS");

module.exports = async function ({ email, password, ...args }) {
  const isUserExist = await this.findOne({ email });

  if (isUserExist) {
    return getResultLikeResponseObject({
      errorObject: THIS_USER_ALREADY_EXISTS,
    });
  }

  const hashedPassword = await getHashedString(password);

  const newUser = new this({
    ...args,
    email,
    password: hashedPassword,
  });

  async function saveNewUser() {
    await newUser.save();
  }

  const token = newUser.generateAuthToken();

  const createdUser = omit(newUser, ["password"]);

  return getResultLikeResponseObject({
    result: {
      newUser: createdUser,
      token,
    },
    fn: saveNewUser,
  });
};
