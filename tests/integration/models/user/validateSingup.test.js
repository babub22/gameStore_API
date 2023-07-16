const { User } = require("../../../../models/user/user");
const {
  createNewUser,
  validUserData,
} = require("../../routes/utils/createNewUser");
const dbConnection = require("../../../../setup/dbConnection");
const { omit } = require("lodash");
const logging = require("../../../../setup/logging");

describe("User.validateSingup", () => {
  beforeAll(() => {
    logging();
    dbConnection();
  });
  afterAll(() => {
    dbConnection();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("if user already exist, it will return 400", async () => {
    await createNewUser();

    const { resultBody } = await User.validateSingup(validUserData);
    const { status } = resultBody;

    expect(status).toEqual(400);
  });
  test("if valid request, it will return token", async () => {
    const { resultBody } = await User.validateSingup(validUserData);
    const { token } = resultBody;

    expect(token).toBeDefined();
  });
  test("if valid request, it will return new user", async () => {
    const { resultBody } = await User.validateSingup(validUserData);
    const { newUser } = resultBody;

    expect(newUser).toMatchObject(omit(validUserData, ["password"]));
  });
});
